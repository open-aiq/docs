---
title: Proto2 board
description: What the Proto2 carrier board does, which revision you're holding, and how you can help build the next one.
---

Hello, and thank you for building an Open AIQ monitor. 💚 If you scanned the QR
code on the back of a board, you're in the right place. This page covers what
Proto2 does, which version you have, and how to help with the next one.

Proto2 is the carrier board that gets Open AIQ off the breadboard. An
ESP32-S3 devkit plugs into it, along with a particle sensor, a temperature and
humidity sensor and a small screen. Everything is through-hole and the copper
is on one side, so a local shop can make it, you can etch it at home, and you
can solder it with a basic iron.

## What it does

- **Measures the air.** A Plantower PMS5003 counts PM1.0, PM2.5 and PM10
  particles, and a Sensirion SHT30 reads temperature and humidity.
- **Shows it on the device.** A 1.3 in OLED cycles through three screens:
  AQI, Readings and Network. The devkit's status LED glows in the current AQI
  band's color.
- **Has three buttons.** Left and right move between screens. Hold pair for
  3 s to open Bluetooth pairing.
- **Sets up from your phone.** The [mobile app](../dashboard/app/) pairs over
  Bluetooth, behind a passkey, and gives the monitor your WiFi details.
- **Uploads readings.** Over WiFi, to your
  [dashboard](../dashboard/) and, if you choose, the public map.
- **Updates itself.** New firmware arrives
  [over the air](../device/ota/), with rollback if something goes wrong.
- **Looks after the sensor.** The particle sensor rests between short bursts,
  so its fan and laser last longer. [Here's why](../device/particle-sensor/).

## Which one do you have?

The revision is printed on the top, under the buttons (`REV I`).

| | Rev I (current) |
| --- | --- |
| Hardware release | [v0.4.8](https://github.com/open-aiq/hardware/releases/tag/v0.4.8) |
| Made | November 2026 |
| Size | 145.5 × 68 mm, 1.6 mm thick |
| Copper | One layer, on the bottom. Holes aren't plated |
| Particle sensor | PMS5003 on its 4-wire cable (`TX RX VCC GND`) |
| Firmware | [v0.4.4](https://github.com/open-aiq/device/releases/tag/v0.4.4) or newer, which rests the sensor by UART command |

Rev I is our first board made for local fabrication. Its capacitors lie flat
between the devkit sockets, and the QR code you scanned replaced the copper
lettering that used to sit there.

On firmware v0.4.3 or older, Rev I still works, but the sensor never rests:
older firmware sleeps it through the SET pin, which the 4-wire cable doesn't
connect. Update to v0.4.4 or newer; monitors that are already set up get it
[over the air](../device/ota/).

### Earlier revisions

- **Rev H** was built for home etching: wider tracks and an even ground fill,
  plus the friendlier silkscreen.
- **Rev E to G** moved the PMS5003 to a 2.54 mm socket, added screw holes
  for it, and widened the gap around the ground fill.
- **Rev A to D** were the first carrier boards: Rev B went single-sided and
  added the pair button, Rev C fixed the OLED socket's pin order, and Rev D
  widened the copper.

Every revision's notes and files are on the
[releases page](../releases/), and the full history is in the
[Proto2 README](https://github.com/open-aiq/hardware/blob/main/pcb/proto2/README.md#revisions).

## Build one

- **Files.** The [latest hardware release](https://github.com/open-aiq/hardware/releases/latest)
  has the Gerbers and a printable PDF with the schematic, the 1:1 bottom copper,
  a hand assembly guide, the parts list and 3D renders.
- **Wiring.** [Hardware and pin map](../device/hardware/) shows which pin goes
  where.
- **Firmware.** [Firmware setup](../device/firmware/) gets the monitor running.
- **Why each part is there.** The
  [design rationale](https://github.com/open-aiq/hardware/blob/main/pcb/proto2/proto2-rationale.pdf)
  walks through every component, with datasheet references.

## Help us make the next one

Open AIQ is open source, and every board gets better because someone tried
it and told us what happened. You don't need to be an engineer to help:

- **Tell us how your build went.** What was confusing, what broke, what you'd
  change. Open an [issue on the hardware repository](https://github.com/open-aiq/hardware/issues).
- **Share a photo** of your board, or a reading that looks off.
- **Improve the design.** The KiCad files are in
  [open-aiq/hardware](https://github.com/open-aiq/hardware), and the
  [contributor setup](../contributing/) shows how to check your changes.
- **Fix the docs.** Every page has an edit link at the bottom.

Thanks for caring for the air we all breathe.
