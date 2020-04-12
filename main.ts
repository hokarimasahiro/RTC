/**
 * makecode RTC Package.
 */
enum rtcType {
    // % block="DS3231"
    ds3231 = 0,
    // % block="MCP79410"
    mcp79410 = 1,
    // % block="rx8035"
    rx8035 = 2,
    // % block="PCF2129"
    pcf2129 = 3,
    // % block="PCF8523"
    pcf8523 = 4,
    // % block="pcf85063"
    pcf85063 = 5,
    // % block="DS3231"
    ds1307 = 6,
    // % block="NON"
    NON = -1
}
enum clockData {
    // % block="年"
    year = 0,
    // % block="月"
    month = 1,
    // % block="日"
    day = 2,
    // % block="曜日"
    weekday = 3,
    // % block="時"
    hour = 4,
    // % block="分"
    minute = 5,
    // % block="秒"
    second = 6
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
    let weekStart = 0   // 0:0-6 1:1-7
    let REG_SEQ = 0     // 0:SECOND,MINUTE,HOUR,WEEKDAY,DAY,MONTH,YEAR  1:0:SECOND,MINUTE,HOUR,DAY,WEEKDAY,MONTH,YEAR
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
     * get device
     */
    //% blockId="getDevice" block="get device"
    //% weight=80 blockGap=8
    export function getDevice():number{
        for(let i=0;1<4;i++){
            if(setDevice(i) != -1) return i; 
        }
        return -1;
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
            case rtcType.ds3231:
                I2C_ADDR = 0x68; REG_CTRL = 0x0e; REG_SECOND = 0x00; REG_SEQ = 0; weekStart = 1;
                break;
            case rtcType.mcp79410:
                I2C_ADDR = 0x6f; REG_CTRL = 0x07; REG_SECOND = 0x00; REG_SEQ = 0; weekStart = 1;
                setReg(REG_SECOND, getReg(REG_SECOND) || 0x80)
                break;
            case rtcType.rx8035:
                I2C_ADDR = 0x32; REG_CTRL = 0x0f; REG_SECOND = 0x00; REG_SEQ = 0; weekStart = 0;
                break;
            case rtcType.pcf2129:
                I2C_ADDR = 0x51; REG_CTRL = 0x00; REG_SECOND = 0x03; REG_SEQ = 1; weekStart = 0;
                break;
            case rtcType.pcf8523:
                I2C_ADDR = 0x58; REG_CTRL = 0x00; REG_SECOND = 0x03; REG_SEQ = 1; weekStart = 0;
                break;
            case rtcType.pcf85063:
                I2C_ADDR = 0x51; REG_CTRL = 0x00; REG_SECOND = 0x04; REG_SEQ = 1; weekStart = 0;
                break;
            case rtcType.ds1307:
                I2C_ADDR = 0x68; REG_CTRL = 0x07; REG_SECOND = 0x00; REG_SEQ = 0; weekStart = 1;
                break;
            default: // DS3231
                I2C_ADDR = 0x68; REG_CTRL = 0x0e; REG_SECOND = 0x00; REG_SEQ = 0; weekStart = 1;
                break;
        }

        if (testi2cr(I2C_ADDR) != 0) return -1;

        switch (deviceType) {
            case rtcType.ds1307:
                break;
            case rtcType.ds3231:
                setReg(REG_CTRL, 0x1c)
                break;
            case rtcType.pcf2129:
                setReg(REG_CTRL, 0x08)
                break;
            case rtcType.pcf8523:
                break;
            case rtcType.pcf85063:
                break;
            case rtcType.mcp79410:
                break;
            case rtcType.rx8035:
                break;
            default:
                break;
        }

        return (testi2cr(I2C_ADDR));
    }
    /**
     * set clock array
     * @param array of time data
     */
    //% blockId="setClockArray" block="set clock %timeArray"
    export function setClockArray(tm:number[]):void{
        setClock(tm[0],tm[1],tm[2],tm[3],tm[4],tm[5],tm[6]);
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

        buf[0] = REG_SECOND;
        buf[1] = DecToHex(second);
        buf[2] = DecToHex(minute);
        buf[3] = DecToHex(hour);
        if (REG_SEQ == 0) {
            buf[4] = DecToHex(weekday + weekStart);
            buf[5] = DecToHex(day);
        } else {
            buf[4] = DecToHex(day);
            buf[5] = DecToHex(weekday + weekStart);
        }
        buf[6] = DecToHex(month);
        buf[7] = DecToHex(year);
        if (deviceType == rtcType.rx8035) {
            buf[0] = REG_SECOND << 4 | 0;
            buf[3] = buf[3] | 0x80;   // 24H bit
        }
        if (deviceType == rtcType.mcp79410) {
            buf[1] = buf[1] | 0x80;       // Start Clock
            buf[4] = buf[4] | 0x08;     // Vbat Enable
        }

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
            case rtcType.rx8035:
                break;
            default:
                pins.i2cWriteNumber(I2C_ADDR, REG_SECOND, NumberFormat.UInt8BE);
        }
        let buf = getRawData();

        retbuf[0] = HexToDec(buf[6 + offset])            // year
        retbuf[1] = HexToDec(buf[5 + offset] & 0x1f)    // month
        if (REG_SEQ == 0) {
            retbuf[2] = HexToDec(buf[4 + offset] & 0x3f)      // day
            retbuf[3] = HexToDec(buf[3 + offset] & 0x07) - weekStart;
        } else {
            retbuf[2] = HexToDec(buf[3 + offset] & 0x3f)      // day
            retbuf[3] = HexToDec(buf[4 + offset] & 0x07) - weekStart;
        }
        retbuf[4] = HexToDec(buf[2 + offset] & 0x3f)     // hour
        retbuf[5] = HexToDec(buf[1 + offset] & 0x7f)   // minute
        retbuf[6] = HexToDec(buf[0 + offset] & 0x7f)   // second
        return retbuf;
    }

    /**
     * getClockData
     */
    //* @param clockData, eg:clockData.year
    //% blockId="getClockData" block="clock %clockData"
    export function getClockData(dt:clockData):clockData{
        return dt;
    }
    /**
     * getClockDevice
     */
    //* @param clockDevice, eg:rtcType.ds3231
    //% blockId="getClockDevice" block="device %clockData"
    export function getClockDevice(dt: rtcType): rtcType {
        return dt;
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
}