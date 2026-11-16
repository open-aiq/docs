// How the monitor is wired, for the hardware page's wiring diagram and pin
// table. `device/src/board.rs` in open-aiq/device is the source of truth for
// pins; when it changes, update `netPin` here and both drawings follow.

export type Layout = 'breadboard' | 'proto2'

export type NetId = 'v5' | 'v3' | 'gnd' | 'sda' | 'scl' | 'tx' | 'rx' | 'set' | 'reset' | 'left' | 'right' | 'pair'

// ESP32-S3-DevKitC-1 headers, pin 1 (by the antenna) first.
export const leftHeader = ['3V3', '3V3', 'RST', '4', '5', '6', '7', '15', '16', '17', '18', '8', '3', '46', '9', '10', '11', '12', '13', '14', '5V', 'GND']
export const rightHeader = ['GND', '43', '44', '1', '2', '42', '41', '40', '39', '38', '37', '36', '35', '0', '45', '48', '47', '21', '20', '19', 'GND', 'GND']

// The devkit pin each net lands on. `tx` is the ESP's TX (the sensor's RX),
// `rx` the ESP's RX (the sensor's TX).
export const netPin: Record<NetId, string> = {
  v5: '5V',
  v3: '3V3',
  gnd: 'GND',
  sda: '5',
  scl: '4',
  tx: '18',
  rx: '17',
  set: '8',
  reset: '16',
  right: '15',
  left: '6',
  pair: '7',
}

export const pinTable: { part: string; signal: string; net: NetId; note?: string }[] = [
  { part: 'OLED + SHT30', signal: 'SDA', net: 'sda' },
  { part: 'OLED + SHT30', signal: 'SCL', net: 'scl' },
  { part: 'PMS5003', signal: 'sensor TX → ESP RX', net: 'rx' },
  { part: 'PMS5003', signal: 'sensor RX ← ESP TX', net: 'tx' },
  { part: 'PMS5003', signal: 'SET (high runs, low rests)', net: 'set' },
  { part: 'PMS5003', signal: 'RESET', net: 'reset', note: 'optional, not driven yet' },
  { part: 'Right button', signal: 'active-low', net: 'right' },
  { part: 'Left button', signal: 'active-low', net: 'left' },
  { part: 'Pair button', signal: 'active-low', net: 'pair', note: 'Proto2 only, not read yet' },
]

export const gpioLabel = (net: NetId) => (/^\d+$/.test(netPin[net]) ? `GPIO ${netPin[net]}` : netPin[net])

export interface Card {
  id: string
  title: string
  tech?: string
  body: string
  hint?: string
  chips?: string[]
  links?: { href: string; label: string }[]
  layouts?: Layout[]
}

export const cards: Card[] = [
  {
    id: 'overview-breadboard',
    title: 'Breadboard build',
    body: 'The devkit is too wide for one breadboard, so it spans two, across the rails between them. We cut the rails off the bottom of the first board and move them to the top, for the I²C bus. Jumper wires run to each part, in the usual colours. Turn off the breadboard to see the same wiring point to point.',
    hint: 'Tap any wire or part to trace it.',
    layouts: ['breadboard'],
  },
  {
    id: 'overview-proto2',
    title: 'Proto2 carrier',
    body: 'The devkit and parts plug into sockets, and the board’s copper does the wiring. The pins are the same as on the breadboard.',
    hint: 'Tap any trace or part to follow it.',
    layouts: ['proto2'],
  },
  {
    id: 'v5',
    title: '5 V power',
    tech: '5V pin',
    body: 'Comes from USB through the devkit and powers the PMS5003, whose fan and laser need 5 V.',
    links: [{ href: '/device/particle-sensor/', label: 'Particle sensor' }],
  },
  {
    id: 'v3',
    title: '3.3 V power',
    tech: '3V3 pin',
    body: 'Powers the OLED and the SHT30. On the breadboard it runs along the + rail.',
  },
  {
    id: 'gnd',
    title: 'Ground',
    tech: 'GND',
    body: 'Every part shares one ground. On the breadboard, one wire takes the devkit’s GND pin up to the first board’s − rail, and everything else joins it there.',
  },
  {
    id: 'sda',
    title: 'I²C data',
    tech: gpioLabel('sda'),
    body: 'The OLED and SHT30 share this line. On the breadboard it has its own rail in the top strip, with one wire down to the devkit. The bus runs at 400 kHz and needs pull-ups: most breakouts have them already, and if yours don’t, add 4.7 kΩ to 3.3 V.',
    chips: ['SDA', '400 kHz'],
  },
  {
    id: 'scl',
    title: 'I²C clock',
    tech: gpioLabel('scl'),
    body: 'The clock for the same bus, shared by the OLED and SHT30. On the breadboard it runs along the strip’s other rail. It needs a pull-up too.',
    chips: ['SCL', '400 kHz'],
  },
  {
    id: 'tx',
    title: 'ESP TX → sensor RX',
    tech: gpioLabel('tx'),
    body: 'The ESP32-S3 talks to the PMS5003 here, at 9600 baud. TX always crosses to RX.',
    chips: ['UART', '9600 baud'],
  },
  {
    id: 'rx',
    title: 'Sensor TX → ESP RX',
    tech: gpioLabel('rx'),
    body: 'The PMS5003 sends its particle readings here, at 9600 baud.',
    chips: ['UART', '9600 baud'],
  },
  {
    id: 'set',
    title: 'Sensor SET',
    tech: gpioLabel('set'),
    body: 'High keeps the PMS5003 running. The firmware pulls it low to rest the sensor between readings.',
  },
  {
    id: 'reset',
    title: 'Sensor RESET',
    tech: gpioLabel('reset'),
    body: 'The firmware doesn’t drive it yet, so the breadboard build leaves it unconnected. Proto2 holds it high with R4.',
    chips: ['optional'],
  },
  {
    id: 'right',
    title: 'Right button',
    tech: gpioLabel('right'),
    body: 'Cycles the screens. Wire it to ground: the chip’s internal pull-up keeps the pin high until you press.',
    hint: 'Hold both buttons for 3 s to start Bluetooth pairing.',
    links: [{ href: '/device/ble/', label: 'BLE provisioning' }],
  },
  {
    id: 'left',
    title: 'Left button',
    tech: gpioLabel('left'),
    body: 'Cycles the screens the other way. Like the right button, it connects the pin to ground when pressed.',
    hint: 'Hold both buttons for 3 s to start Bluetooth pairing.',
    links: [{ href: '/device/ble/', label: 'BLE provisioning' }],
  },
  {
    id: 'pair',
    title: 'Pair button',
    tech: gpioLabel('pair'),
    body: 'Only on Proto2. It’s for starting pairing later; the firmware doesn’t read it yet, so hold left and right for 3 s instead.',
    layouts: ['proto2'],
  },
  {
    id: 'devkit',
    title: 'ESP32-S3 devkit',
    tech: 'DevKitC-1',
    body: 'Runs the firmware. Every signal we use is on one header, and the status LED shows the AQI colour (GPIO 48, or 38 on v1.1 boards).',
    links: [{ href: '/device/firmware/', label: 'Firmware' }],
  },
  {
    id: 'pms',
    title: 'PMS5003',
    tech: 'particle sensor',
    body: 'Counts particles with a small fan and a laser. It runs on 5 V, but its data pins use 3.3 V logic, so they connect straight to the devkit. Cable and adapter pin orders vary, so match the labels.',
    links: [{ href: '/device/particle-sensor/', label: 'Particle sensor' }],
  },
  {
    id: 'oled',
    title: 'OLED display',
    tech: 'SH1106 or SSD1306',
    body: 'A 128×64 screen on the I²C bus, at 0x3C or 0x3D. Modules order their pins differently, and some swap GND and VCC, so check yours before you plug it in.',
    chips: ['0x3C', '0x3D'],
  },
  {
    id: 'sht',
    title: 'SHT30',
    tech: 'temperature + humidity',
    body: 'Shares the I²C bus, at 0x44 or 0x45. It sits on wires, away from the devkit’s warm spots, so the temperature stays honest.',
    chips: ['0x44', '0x45'],
  },
  {
    id: 'breadboard',
    title: 'Breadboard',
    body: 'Two boards, because the devkit’s headers are 25.4 mm apart. It spans the seam, leaving four free holes above each signal pin. Holes in a short column of five are joined, so a wire there connects to that pin. The first board’s bottom rails would sit under the devkit, so cut them off (a sharp knife through the backing works) and stick them along the top. That strip carries SCL and SDA; the long rails below it carry 3.3 V (+) and ground (−).',
    layouts: ['breadboard'],
  },
  {
    id: 'proto2',
    title: 'Proto2 board',
    tech: 'rev C',
    body: 'Single-sided and all through-hole, so you can solder it by hand. The traces here are simplified; the board files have the real routing.',
    links: [{ href: 'https://github.com/open-aiq/hardware/tree/main/pcb/proto2', label: 'Proto2 files' }],
    layouts: ['proto2'],
  },
  {
    id: 'pullups-i2c',
    title: 'R1, R2',
    tech: '4.7 kΩ',
    body: 'I²C pull-ups from SDA and SCL to 3.3 V. They’re built in, so your breakouts don’t need their own.',
    layouts: ['proto2'],
  },
  {
    id: 'pullups-pms',
    title: 'R3, R4',
    tech: '10 kΩ',
    body: 'Hold SET and RESET high, so the PMS5003 stays awake and out of reset while the devkit boots.',
    layouts: ['proto2'],
  },
  {
    id: 'caps',
    title: 'C1–C4',
    tech: 'capacitors',
    body: '47 µF and 100 nF on 5 V, 10 µF and 100 nF on 3.3 V. They keep the supply steady for the sensor and the radio.',
    layouts: ['proto2'],
  },
]
