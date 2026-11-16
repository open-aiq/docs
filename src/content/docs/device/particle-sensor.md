---
title: The particle sensor
description: Why the PMS5003 rests between readings, what averaging can and can't fix, and the sensors we compared it with.
---

The monitor measures particles with a Plantower **PMS5003**. It pulls air
through with a small fan and counts particles with a laser. Both parts wear out
with use, so we let the sensor rest between short bursts. This page explains
that choice, what averaging can and can't fix, and the other sensors we looked
at. Every claim links to its source, and we've noted where a source is weaker.

## What the datasheet says

These come from Plantower's PMS5003 manual, V2.3 (2016). We keep a copy in the
firmware repo under
[`docs/datasheets/`](https://github.com/open-aiq/device/tree/main/docs/datasheets),
with its checksum and page numbers.

| | |
| --- | --- |
| How often it reports | Every 2.3 s when the air is steady; every 200–800 ms when it changes fast |
| Warm-up | Readings are stable "at least 30 seconds after the sensor wakeup" |
| Sleep | Pulling its SET pin low stops the fan and laser |
| Power | 100 mA running, 200 µA asleep |
| Expected life | MTTF (mean time to failure) of 3 years, with no test conditions given |
| Sensor-to-sensor spread | ±10 µg/m³ up to 100 µg/m³, ±10 % above that |
| Sleep cycling | Plantower's endurance test toggles sleep every 2 s for 72 hours, so frequent rests are safe |

Two honest caveats from the same manual: Plantower only promises that its
sensors agree with each other, not with reference instruments, and it rates
the sensor for normal indoor air, asking for extra protection outdoors.

## Why we let it rest

A sensor that runs all day ages fast. The best long-term look we found is a
large study of PurpleAir monitors, each with two PMS5003s running
nonstop ([deSouza et al., 2023](https://doi.org/10.1039/D2EA00142J)). The two
sensors in a monitor disagree more often as they age, and their bias **rises
sharply after about 3.5 years**, more so in hot, humid places. That lines up with the
3-year MTTF in the datasheet.

Sleep stops both the fan and the laser, so a sensor that runs a fifth of the
time spends a fifth as many hours on its wearing parts. Here's the cycle:

1. Every 5 minutes, we wake the sensor.
2. We ignore its readings for 30 s while the fan settles, as the datasheet asks.
3. We average every reading for the next 30 s, about 13 of them.
4. It sleeps for the remaining 4 minutes.

Each 10-minute upload averages two bursts, about 26 readings. The fan and laser
run 60 s in every 5 minutes, so we expect roughly five times longer life.
That's an estimate from running hours, not a measured result. No study we
found has tested it directly.

What we give up: a short spike between bursts, like a burst of cooking smoke,
can be missed. For readings shared every 10 minutes and viewed as hourly
averages, we think that's a fair trade.

## Averaging steadies readings, but doesn't correct them

Averaging many readings smooths out random noise, so one odd reading can't
swing an upload. It can't fix a sensor that reads high across the board.

Raw PMS5003 readings run about **40 % high** in most of the US, and humidity
makes it worse, because damp particles swell and look bigger to the laser. The
US EPA built a correction from co-located reference monitors that brings the
typical error from 8 down to 3 µg/m³ on 24-hour averages
([Barkjohn et al., 2021](https://amt.copernicus.org/articles/14/4617/2021/)):

```text
PM2.5 = 0.524 × PM2.5 (CF=1) − 0.0862 × relative humidity + 5.75
```

We don't apply this yet. It needs the sensor's CF=1 values (we send its
"atmospheric" values today) and a humidity reading next to the sensor, which
the monitor already has. It's planned as a separate change, so for now please
treat readings as useful for trends rather than exact values.

## Other sensors we looked at

We compared the PMS5003 with five other sensors before deciding to stay with
it for now.

| Sensor | What it offers | Why we're not switching |
| --- | --- | --- |
| **Sensirion SPS30** | Rated for "more than ten years", resists dust build-up, cleans its own fan weekly, reports every second | It lasts longer, but isn't clearly more accurate: in a field test it also read high, and it needs the same humidity correction. It costs about three times as much and needs a new driver and connector. It's our strongest candidate for the purpose-built board. |
| **Sensirion SEN66 / SEN5x** | Particles plus temperature, humidity, VOC and NOx (and CO₂ on the SEN66) in one module | We'd pay for gas sensing we don't use yet, and it overlaps our SHT30. Worth another look if VOC or CO₂ joins the roadmap. |
| **Nova SDS011** | Popular with community networks; has a built-in timed sleep mode | Its laser is rated "up to 8000 hours", well short of the PMS5003's 3-year MTTF (about 26,000 hours), and it's bigger. |
| **Honeywell HPMA115S0** | Compact, UART like ours | Its stated PM2.5 accuracy (±15 %) is looser than the PMS5003's, and Honeywell's own documents disagree on its life (20,000 hours or 10 years). |
| **Plantower PMSA003I** | The same Plantower design with an I²C connection | Same fan, laser and bias as the PMS5003, so it wouldn't help with any of this. |

A year-long study ran eight SPS30s and eight PMS5003s next to a reference
monitor in Southampton
([Bulot et al., 2023](https://eprints.soton.ac.uk/482725/)). Both reached
reference-grade PM2.5 only after calibration that included humidity. That's
the main lesson for us: calibration matters more than the choice between
these two sensors, which is why it's our next step.

## Sources

How much weight each source carries:

- **Manufacturer datasheets** (primary, but written by the seller):
  [Plantower PMS5003 V2.3](https://github.com/open-aiq/device/tree/main/docs/datasheets),
  [Sensirion SPS30](https://cdn.sparkfun.com/assets/4/e/e/f/8/Sensirion_PM_Sensors_Datasheet_SPS30.pdf)
  (v1.0, March 2020),
  [Nova SDS011 V1.3](https://components101.com/sites/default/files/component_datasheet/SDS011-Sensor-Datasheet.pdf),
  [Plantower PMSA003I](https://www.mouser.com/datasheet/2/737/4505_PMSA003I_series_data_manual_English_V2_6-2490334.pdf).
  These are copies hosted by distributors; Plantower and Nova don't offer
  public downloads.
- **Peer-reviewed studies** (independent):
  [deSouza et al., 2023](https://doi.org/10.1039/D2EA00142J) on long-term
  drift; [Barkjohn et al., 2021](https://amt.copernicus.org/articles/14/4617/2021/)
  on the EPA correction;
  [Bulot et al., 2023](https://eprints.soton.ac.uk/482725/) on SPS30 and
  PMS5003 calibration.
- **Agency field test** (independent):
  [South Coast AQMD AQ-SPEC evaluation of the SPS30](https://www.aqmd.gov/docs/default-source/aq-spec/field-evaluations/sensirion-sps30-evaluation-kit---field-evaluation.pdf).
- **Weaker sources** (product pages and distributor listings): the SEN66 and
  SEN5x details and the Honeywell figures. We couldn't confirm them in a
  datasheet we could open, so treat them as indicative.

What we couldn't verify, so we don't rely on it: the "8,000-hour laser" figure
often quoted for the PMS5003 (it isn't in Plantower's manual and seems to come
from the SDS011's datasheet), and which sensor did better in the Southampton
study (we couldn't access its detailed results).
