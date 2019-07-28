/**
 * makecode RTC Package.
 */
enum rtcType {
    // % block="DS1307"
    ds1307 = 0,
    // % block="DS3231"
    ds3231 = 1,
    // % block="PCF2129"
    pcf2129 = 2,
    // % block="PCF8523"
    pcf8523 = 3,
    // % block="pcf85063"
    pcf85063 = 4,
    // % block="MCP79410"
    mcp79410 = 5,
    // % block="rx8035"
    rx8035 = 6
}

/**
 * RTC block
 */
//% weight=10 color=#800080 icon="\uf017" block="RTC"
namespace rtc {
    //      ds1307      ds3231      pcf2129     pcf8523     pcf85063    mcp79410    rx8085
    let rtcAddress = [0x68, 0x68, 0x51, 0x68, 0x51, 0x6f, 0x32];
    let ctrlAddress = [0x07, 0x0e, 0x00, 0x00, 0x00, 0x07, 0x0f];
    let secondAddress = [0x00, 0x00, 0x03, 0x03, 0x04, 0x00, 0x00];
    let minuteAddress = [0x01, 0x01, 0x04, 0x04, 0x05, 0x01, 0x01];
    let hourAddress = [0x02, 0x02, 0x05, 0x05, 0x06, 0x02, 0x02];
    let weekdayAddress = [0x03, 0x03, 0x07, 0x07, 0x08, 0x03, 0x03];
    let dayAddress = [0x04, 0x04, 0x06, 0x06, 0x07, 0x04, 0x04];
    let monthAddress = [0x05, 0x05, 0x08, 0x08, 0x09, 0x05, 0x05];
    let yearAddress = [0x06, 0x06, 0x09, 0x09, 0x0a, 0x06, 0x06];
    let weekdayStart = [1, 1, 0, 0, 0, 1, 0];

    let deviceType = 6;   // RX8085
    let I2C_ADDR = rtcAddress[deviceType]
    let REG_CTRL = ctrlAddress[deviceType]
    let REG_SECOND = secondAddress[deviceType]
    let REG_MINUTE = minuteAddress[deviceType]
    let REG_HOUR = hourAddress[deviceType]
    let REG_WEEKDAY = weekdayAddress[deviceType]
    let REG_DAY = dayAddress[deviceType]
    let REG_MONTH = monthAddress[deviceType]
    let REG_YEAR = yearAddress[deviceType]

    //% shim=rtc::testi2cr
    function testi2cr(n: number): number {
        return 0;
    }
    //% shim=rtc::testi2cw
    function testi2cw(n: number): number {
        return 0;
    }
    /**
      * test read i2c device
      * @param ad i2c address, eg: 0x32
      */
    //% blockId=test_read_i2c_device block="test read i2c device %ad"
    export function testReadI2c(ad: number): number {
        return (testi2cr(ad));
    }

    /**
     * set reg
     */
    function setReg(reg: number, dat: number): void {
        let buf = pins.createBuffer(2);
        buf[0] = reg;
        buf[1] = dat;
        pins.i2cWriteBuffer(I2C_ADDR, buf);
    }

    /**
     * get reg
     */
    function getReg(reg: number): number {
        pins.i2cWriteNumber(I2C_ADDR, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(I2C_ADDR, NumberFormat.UInt8BE);
    }

    /**
     * convert a BCD data to Dec
     */
    function HexToDec(dat: number): number {
        return (dat >> 4) * 10 + (dat & 0x0f);
    }

    /**
     * convert a Dec data to BCD
     */
    function DecToHex(dat: number): number {
        return Math.trunc(dat / 10) << 4 | (dat % 10)
    }

    /**
     * set device
     */
    //* @param devType device type, eg:ds1307
    //% blockId="setDevice" block="set device %devType"
    //% weight=80 blockGap=8
    export function setDevice(devType: number): number {
        deviceType = devType;

        I2C_ADDR = rtcAddress[deviceType];
        REG_CTRL = ctrlAddress[deviceType]
        REG_SECOND = secondAddress[deviceType]
        REG_MINUTE = minuteAddress[deviceType]
        REG_HOUR = hourAddress[deviceType]
        REG_WEEKDAY = weekdayAddress[deviceType]
        REG_DAY = dayAddress[deviceType]
        REG_MONTH = monthAddress[deviceType]
        REG_YEAR = yearAddress[deviceType]

        return (start());
    }
    /**
     * set clock
     * @param year data of year, eg: 2019
     * @param month data of month, eg: 3
     * @param day data of day, eg: 14
     * @param weekday data of weekday, eg: 4
     * @param hour data of hour, eg: 5
     * @param minute data of minute, eg: 30
     * @param second data of second, eg: 0
     */
    //% weight=70 blockGap=8
    //% blockId="setClock" block="set year %year|month %month|day %day|weekday %weekday|hour %hour|minute %minute|second %second"
    export function setClock(year: number, month: number, day: number, weekday: number, hour: number, minute: number, second: number): void {
        let buf = pins.createBuffer(8);

        if (deviceType == rtcType.rx8035) buf[0] = REG_SECOND << 4 || 0; else buf[0] = REG_SECOND;
        if (deviceType == rtcType.pcf8523) buf[REG_SECOND + 1] = DecToHex(second) || 0x80; else buf[REG_SECOND + 1] = DecToHex(second);
        buf[REG_MINUTE + 1] = DecToHex(minute);
        if (deviceType == rtcType.rx8035) buf[REG_HOUR + 1] = DecToHex(hour) || 0x80; else buf[REG_HOUR + 1] = DecToHex(hour);
        buf[REG_WEEKDAY + 1] = DecToHex(weekday - 1 + weekdayStart[deviceType]);
        buf[REG_DAY + 1] = DecToHex(day);
        buf[REG_MONTH + 1] = DecToHex(month);
        buf[REG_YEAR + 1] = DecToHex(year);

        pins.i2cWriteBuffer(I2C_ADDR, buf)
    }
    /**
     * get clock
     */
    //% blockId="getClock" block="get clock"
    //% weight=68 blockGap=8
    export function getClock(): number[] {
        let retbuf = [0, 0, 0, 0, 0, 0, 0];
        let offset: number;
        if (deviceType == rtcType.rx8035) offset = 1; else offset = 0;

        switch (deviceType) {
            case 5:
                break;
            default:
                pins.i2cWriteNumber(I2C_ADDR, 0, NumberFormat.UInt8BE);
        }
        let buf = getRawData();

        retbuf[0] = HexToDec(buf[REG_YEAR + offset])            // year
        retbuf[1] = HexToDec(buf[REG_MONTH + offset] & 0x1f)    // month
        retbuf[2] = HexToDec(buf[REG_DAY + offset] & 0x3f)      // day
        retbuf[3] = HexToDec(buf[REG_WEEKDAY + offset] & 0x07) + 1 - weekdayStart[deviceType];
        retbuf[4] = HexToDec(buf[REG_HOUR + offset] & 0x3f)     // hour
        retbuf[5] = HexToDec(buf[REG_MINUTE + offset] & 0x7f)   // minute
        retbuf[6] = HexToDec(buf[REG_SECOND + offset] & 0x7f)   // second
        return retbuf;
    }
    /**
     * get RTC RAW DATA
     */
    //% blockId="getRawData" block="get RTC RAW data"
    //% weight=46 blockGap=8
    export function getRawData(): number[] {
        let retbuf = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        let buf = pins.i2cReadBuffer(I2C_ADDR, 16);
        for (let i = 0; i < 16; i++) {
            retbuf[i] = buf[i]
        }
        return retbuf;
    }
    /**
     * start
     */
    //% blockId="start" block="start"
    //% weight=44 blockGap=8
    export function start(): number {
        switch (deviceType) {
            default:
                setReg(REG_CTRL, 0);
                break;
        }
        return testi2cr(REG_CTRL);
    }
}