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

    let deviceType = 6;   // RX8085
    let I2C_ADDR = 0x32
    let REG_CTRL = 0x0f
    let REG_SECOND = 0x0
    let REG_MINUTE = 0x01
    let REG_HOUR = 0x02
    let REG_WEEKDAY = 0x03
    let REG_DAY = 0x04
    let REG_MONTH = 0x05
    let REG_YEAR = 0x06
    let weekStart = 1

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
    export function setDevice(devType: rtcType): number {

        deviceType = devType;

        switch (deviceType) {
            case 0:     // DS1307
                I2C_ADDR = 0x68; REG_CTRL = 0x07; REG_SECOND = 0x00; REG_MINUTE = 0x01; REG_HOUR = 0x02; REG_WEEKDAY = 0x03; REG_DAY = 0x04; REG_MONTH = 0x05; REG_YEAR = 0x06; weekStart = 1;
                break;
            case 1:     // DS3231
                I2C_ADDR = 0x68; REG_CTRL = 0x07; REG_SECOND = 0x00; REG_MINUTE = 0x01; REG_HOUR = 0x02; REG_WEEKDAY = 0x03; REG_DAY = 0x04; REG_MONTH = 0x05; REG_YEAR = 0x06; weekStart = 1;
                break;
            case 2:     // PCF2129
                I2C_ADDR = 0x51; REG_CTRL = 0x00; REG_SECOND = 0x03; REG_MINUTE = 0x04; REG_HOUR = 0x05; REG_WEEKDAY = 0x07; REG_DAY = 0x06; REG_MONTH = 0x08; REG_YEAR = 0x09; weekStart = 0;
                break;
            case 3:     // PCF8523
                I2C_ADDR = 0x58; REG_CTRL = 0x00; REG_SECOND = 0x03; REG_MINUTE = 0x04; REG_HOUR = 0x05; REG_WEEKDAY = 0x07; REG_DAY = 0x06; REG_MONTH = 0x08; REG_YEAR = 0x09; weekStart = 0;
                break;
            case 4:     // PCF85063
                I2C_ADDR = 0x51; REG_CTRL = 0x00; REG_SECOND = 0x04; REG_MINUTE = 0x05; REG_HOUR = 0x06; REG_WEEKDAY = 0x08; REG_DAY = 0x07; REG_MONTH = 0x09; REG_YEAR = 0x0a; weekStart = 0;
                break;
            case 5:     // MCP79410
                I2C_ADDR = 0x6f; REG_CTRL = 0x07; REG_SECOND = 0x00; REG_MINUTE = 0x01; REG_HOUR = 0x02; REG_WEEKDAY = 0x03; REG_DAY = 0x04; REG_MONTH = 0x05; REG_YEAR = 0x06; weekStart = 1;
                break;
            case 6:     // RX8035
                I2C_ADDR = 0x32; REG_CTRL = 0x0f; REG_SECOND = 0x00; REG_MINUTE = 0x01; REG_HOUR = 0x02; REG_WEEKDAY = 0x03; REG_DAY = 0x04; REG_MONTH = 0x05; REG_YEAR = 0x06; weekStart = 0;
                break;
            default:
                I2C_ADDR = 0x32; REG_CTRL = 0x0f; REG_SECOND = 0x00; REG_MINUTE = 0x01; REG_HOUR = 0x02; REG_WEEKDAY = 0x03; REG_DAY = 0x04; REG_MONTH = 0x05; REG_YEAR = 0x06; weekStart = 0;
                break;
        }

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
        if (deviceType == rtcType.mcp79410) buf[REG_SECOND + 1] = DecToHex(second) || 0x80; else buf[REG_SECOND + 1] = DecToHex(second);
        buf[REG_MINUTE + 1] = DecToHex(minute);
        if (deviceType == rtcType.rx8035) buf[REG_HOUR + 1] = DecToHex(hour) || 0x80; else buf[REG_HOUR + 1] = DecToHex(hour);
        buf[REG_WEEKDAY + 1] = DecToHex(weekday - 1 + weekStart);
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
            case 6:     // RX8035
                break;
            default:
                pins.i2cWriteNumber(I2C_ADDR, 0, NumberFormat.UInt8BE);
        }
        let buf = getRawData();

        retbuf[0] = HexToDec(buf[REG_YEAR + offset])            // year
        retbuf[1] = HexToDec(buf[REG_MONTH + offset] & 0x1f)    // month
        retbuf[2] = HexToDec(buf[REG_DAY + offset] & 0x3f)      // day
        retbuf[3] = HexToDec(buf[REG_WEEKDAY + offset] & 0x07) + 1 - weekStart;
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
            case 5: //MCP79410
                setReg(REG_SECOND, getReg(REG_SECOND) || 0x80)
                break;
            default:
                setReg(REG_CTRL, 0);
                break;
        }
        return testi2cr(I2C_ADDR);
    }
}