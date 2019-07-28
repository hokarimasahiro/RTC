// tests go here; this will not be compiled when this package is used as a library
//basic.forever(function () {
//    let buf = rtc.getClock()
//    for (let i = 0; i < 7; i++) {
//        basic.clearScreen()
//        basic.pause(200)
//        basic.showNumber(buf[i])
//        basic.pause(300)
//    }
//})
basic.showNumber(rtc.testReadI2c(0x32))
basic.pause(500);
basic.showString("a")
basic.pause(2000);
basic.clearScreen()
basic.showNumber(rtc.setDevice(rtcType.rx8035))
basic.pause(2000);
