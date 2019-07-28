// tests go here; this will not be compiled when this package is used as a library
basic.forever(function () {
    let buf = rtc.getClock()
    for (let i = 0; i < 16; i++) {
        basic.clearScreen()
        basic.pause(200)
        basic.showNumber(buf[i])
        basic.pause(300)
    }
})
basic.showNumber(rtc.testReadI2c(0x32))
basic.pause(1000)
rtc.setDevice(6)