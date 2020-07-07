// tests go here; this will not be compiled when this package is used as a library
basic.forever(function () {
    basic.showNumber(rtc.testReadI2c(0x32))
    basic.pause(500);
    basic.showString("a")
    basic.pause(2000);
    basic.clearScreen()
    basic.showNumber(rtc.getDevice())
    basic.pause(2000);
})
