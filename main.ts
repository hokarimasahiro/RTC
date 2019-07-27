/**
 * makecode RTC Package.
 */

/**
 * RTC block
 */
//% weight=10 color=#800080 icon="\uf017" block="rx8035"
namespace rtc {
    let I2C_ADDR = 0x32
    let REG_CTRL1 = 0x0e
    let REG_CTRL2 = 0x0f
    let REG_SECOND = 0x00
    let REG_MINUTE = 0x01
    let REG_HOUR = 0x02
    let REG_WEEKDAY = 0x03
    let REG_DAY = 0x04
    let REG_MONTH = 0x05
    let REG_YEAR = 0x06

    /**
     * set reg
     */
    function setReg(reg: number, dat: number): void {
        let buf = pins.createBuffer(2);
        buf[0] = reg << 4 | 0x00;
        buf[1] = dat;
        pins.i2cWriteBuffer(I2C_ADDR, buf);
    }

    /**
     * get reg
     */
    function getReg(reg: number): number {
        pins.i2cWriteNumber(I2C_ADDR, reg << 4 | 0x04, NumberFormat.UInt8BE);
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
     * set Date and Time
     * @param year data of year, eg: 2019
     * @param month data of month, eg: 3
     * @param day data of day, eg: 14
     * @param weekday data of weekday, eg: 4
     * @param hour data of hour, eg: 5
     * @param minute data of minute, eg: 30
     * @param second data of second, eg: 0
     */
    //% blockId="setSecond" block="set second %dat"
    //% weight=70 blockGap=8
    //% blockId="setDateTime" block="set year %year|month %month|day %day|weekday %weekday|hour %hour|minute %minute|second %second"
    export function DateTime(year: number, month: number, day: number, weekday: number, hour: number, minute: number, second: number): void {
        let buf = pins.createBuffer(8);
        buf[0] = REG_SECOND << 4 | 0x00;
        buf[1] = DecToHex(second);
        buf[2] = DecToHex(minute);
        buf[3] = DecToHex(hour) | 0x80;		// 24H mode
        buf[4] = DecToHex(weekday);
        buf[5] = DecToHex(day);
        buf[6] = DecToHex(month);
        buf[7] = DecToHex(year);
        pins.i2cWriteBuffer(I2C_ADDR, buf)
        setReg(REG_CTRL2, 0x00)
    }
    /**
     * get RTC DATA
     */
    //% blockId="getData" block="get RTC data"
    //% weight=68 blockGap=8
    export function getData(): number[] {
        let retbuf = [0, 0, 0, 0, 0, 0, 0]
        let buf = getRawData();
        retbuf[0] = HexToDec(buf[7])        // year
        retbuf[1] = HexToDec(buf[6] & 0x1f) // month
        retbuf[2] = HexToDec(buf[5] & 0x3f) // day
        retbuf[3] = HexToDec(buf[4] & 0x07) // weekday
        retbuf[4] = HexToDec(buf[3] & 0x3f) // hour
        retbuf[5] = HexToDec(buf[2] & 0x7f) // minute
        retbuf[6] = HexToDec(buf[1] & 0x7f) // second
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
     * Clear VDET
     */
    //% blockId="clearVdet" block="clear VDET"
    //% weight=44 blockGap=8
    export function clearVdet(): void {
        setReg(REG_CTRL2, 0x00)
    }
}