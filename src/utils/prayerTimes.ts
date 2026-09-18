import { PrayerName, PrayerTimeItem } from '../types';

export interface LocationConfig {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: number; // offset in hours from UTC
  calculationMethod: 'MWL' | 'ISNA' | 'UmmAlQura' | 'Egyptian' | 'Karachi';
}

export const DEFAULT_CITIES: LocationConfig[] = [
  { name: 'Mecca', country: 'Saudi Arabia', latitude: 21.4225, longitude: 39.8262, timezone: 3, calculationMethod: 'UmmAlQura' },
  { name: 'Medina', country: 'Saudi Arabia', latitude: 24.4672, longitude: 39.6111, timezone: 3, calculationMethod: 'UmmAlQura' },
  { name: 'Cairo', country: 'Egypt', latitude: 30.0444, longitude: 31.2357, timezone: 2, calculationMethod: 'Egyptian' },
  { name: 'London', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278, timezone: 1, calculationMethod: 'MWL' },
  { name: 'New York', country: 'USA', latitude: 40.7128, longitude: -74.006, timezone: -4, calculationMethod: 'ISNA' },
  { name: 'Istanbul', country: 'Turkey', latitude: 41.0082, longitude: 28.9784, timezone: 3, calculationMethod: 'MWL' },
  { name: 'Jakarta', country: 'Indonesia', latitude: -6.2088, longitude: 106.8456, timezone: 7, calculationMethod: 'MWL' },
  { name: 'Kuala Lumpur', country: 'Malaysia', latitude: 3.139, longitude: 101.6869, timezone: 8, calculationMethod: 'MWL' },
  { name: 'Abuja', country: 'Nigeria', latitude: 9.0765, longitude: 7.3986, timezone: 1, calculationMethod: 'MWL' },
  { name: 'Dubai', country: 'UAE', latitude: 25.2048, longitude: 55.2708, timezone: 4, calculationMethod: 'UmmAlQura' },
];

// Helper trig functions in degrees
const dsin = (d: number) => Math.sin((d * Math.PI) / 180);
const dcos = (d: number) => Math.cos((d * Math.PI) / 180);
const dtan = (d: number) => Math.tan((d * Math.PI) / 180);
const darcsin = (x: number) => (Math.asin(x) * 180) / Math.PI;
const darccos = (x: number) => (Math.acos(x) * 180) / Math.PI;
const darctan = (x: number) => (Math.atan(x) * 180) / Math.PI;
const darctan2 = (y: number, x: number) => (Math.atan2(y, x) * 180) / Math.PI;

// Julian day from Gregorian date
function getJulianDay(year: number, month: number, day: number): number {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
}

// Sun coordinates: returns { declination (deg), equationOfTime (minutes) }
function getSunCoordinates(jd: number) {
  const d = jd - 2451545.0;
  const g = (357.529 + 0.98560028 * d) % 360;
  const q = (280.459 + 0.98564736 * d) % 360;
  const L = (q + 1.915 * dsin(g) + 0.02 * dsin(2 * g)) % 360;
  const e = 23.439 - 0.00000036 * d;
  const RA = darctan2(dcos(e) * dsin(L), dcos(L)) / 15;
  const declination = darcsin(dsin(e) * dsin(L));
  const equationOfTime = (q / 15 - (RA < 0 ? RA + 24 : RA)) * 60;
  return { declination, equationOfTime };
}

// Astronomical calculation of prayer times
export function calculatePrayerTimes(
  date: Date,
  location: LocationConfig,
  isTraveler: boolean = false
): PrayerTimeItem[] {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const jd = getJulianDay(year, month, day);

  const { declination, equationOfTime } = getSunCoordinates(jd);
  const lat = location.latitude;
  const lng = location.longitude;

  // Local timezone offset in hours
  const tz = -date.getTimezoneOffset() / 60;

  // Midday (Dhuhr) solar transit in hours (local time)
  const transit = 12 + tz - lng / 15 - equationOfTime / 60;

  // Calculation method angles for Fajr and Isha
  let fajrAngle = 18;
  let ishaAngle = 17;

  if (location.calculationMethod === 'ISNA') {
    fajrAngle = 15;
    ishaAngle = 15;
  } else if (location.calculationMethod === 'Egyptian') {
    fajrAngle = 19.5;
    ishaAngle = 17.5;
  } else if (location.calculationMethod === 'Karachi') {
    fajrAngle = 18;
    ishaAngle = 18;
  } else if (location.calculationMethod === 'UmmAlQura') {
    fajrAngle = 18.5;
    // Isha is 90 mins after Maghrib in Umm Al-Qura
  }

  // Sunrise and Sunset hour angles
  const sunAngle = -0.8333; // atmospheric refraction & sun semi-diameter
  const sunCos = (dsin(sunAngle) - dsin(lat) * dsin(declination)) / (dcos(lat) * dcos(declination));
  const sunHourAngle = darccos(Math.min(1, Math.max(-1, sunCos))) / 15;

  const sunriseHour = transit - sunHourAngle;
  const sunsetHour = transit + sunHourAngle;

  // Fajr hour angle
  const fajrCos = (dsin(-fajrAngle) - dsin(lat) * dsin(declination)) / (dcos(lat) * dcos(declination));
  const fajrHourAngle = darccos(Math.min(1, Math.max(-1, fajrCos))) / 15;
  const fajrHour = transit - fajrHourAngle;

  // Asr hour angle (Standard Shafi'i/Hanbali/Maliki: shadow length = object + noon shadow)
  const asrAlt = darccot(1 + dtan(Math.abs(lat - declination)));
  const asrCos = (dsin(asrAlt) - dsin(lat) * dsin(declination)) / (dcos(lat) * dcos(declination));
  const asrHourAngle = darccos(Math.min(1, Math.max(-1, asrCos))) / 15;
  const asrHour = transit + asrHourAngle;

  // Isha
  let ishaHour = 0;
  if (location.calculationMethod === 'UmmAlQura') {
    ishaHour = sunsetHour + 1.5; // 90 minutes after Maghrib
  } else {
    const ishaCos = (dsin(-ishaAngle) - dsin(lat) * dsin(declination)) / (dcos(lat) * dcos(declination));
    const ishaHourAngle = darccos(Math.min(1, Math.max(-1, ishaCos))) / 15;
    ishaHour = transit + ishaHourAngle;
  }

  // Tahajjud / Qiyam (midpoint between Isha and Fajr, ideal in last third)
  const qiyamHour = fajrHour - 1.5;

  function toDate(decimalHour: number): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const totalMinutes = Math.round(decimalHour * 60);
    d.setMinutes(totalMinutes);
    return d;
  }

  function formatTime(d: Date): string {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  const timesRaw: { id: PrayerName; name: string; arabicName: string; dateObj: Date; defaultRakahs: number }[] = [
    { id: 'Fajr', name: 'Fajr', arabicName: 'الفجر', dateObj: toDate(fajrHour), defaultRakahs: 2 },
    { id: 'Sunrise', name: 'Sunrise (Shuruq)', arabicName: 'الشروق', dateObj: toDate(sunriseHour), defaultRakahs: 0 },
    { id: 'Dhuhr', name: 'Dhuhr', arabicName: 'الظهر', dateObj: toDate(transit + 0.05), defaultRakahs: isTraveler ? 2 : 4 },
    { id: 'Asr', name: 'Asr', arabicName: 'العصر', dateObj: toDate(asrHour), defaultRakahs: isTraveler ? 2 : 4 },
    { id: 'Maghrib', name: 'Maghrib', arabicName: 'المغرب', dateObj: toDate(sunsetHour + 0.03), defaultRakahs: 3 },
    { id: 'Isha', name: 'Isha', arabicName: 'العشاء', dateObj: toDate(ishaHour), defaultRakahs: isTraveler ? 2 : 4 },
    { id: 'Qiyam', name: 'Qiyam (Tahajjud)', arabicName: 'قيام الليل', dateObj: toDate(qiyamHour), defaultRakahs: 2 },
  ];

  const now = date.getTime();
  let nextFound = false;

  // Determine current, passed, and next prayer
  return timesRaw.map((item, idx) => {
    const itemTime = item.dateObj.getTime();
    const isPassed = itemTime < now;
    let isNext = false;
    let isCurrent = false;

    if (!isPassed && !nextFound && item.id !== 'Sunrise') {
      isNext = true;
      nextFound = true;
    }

    // Current prayer is the one whose window we are in right now
    if (idx < timesRaw.length - 1) {
      const nextTime = timesRaw[idx + 1].dateObj.getTime();
      if (now >= itemTime && now < nextTime && item.id !== 'Sunrise') {
        isCurrent = true;
      }
    } else if (idx === timesRaw.length - 1 && now >= itemTime) {
      isCurrent = true;
    }

    return {
      id: item.id,
      name: item.name,
      arabicName: item.arabicName,
      timeString: formatTime(item.dateObj),
      timestamp: itemTime,
      rakahs: item.defaultRakahs,
      isPassed,
      isCurrent,
      isNext,
    };
  });
}

function darccot(x: number): number {
  return (Math.atan(1 / x) * 180) / Math.PI;
}

// Calculate Qibla bearing from current coordinates to Makkah (21.4225, 39.8262)
export function getQiblaDirection(latitude: number, longitude: number): number {
  const meccaLat = 21.4225;
  const meccaLng = 39.8262;

  const y = dsin(meccaLng - longitude);
  const x = dcos(latitude) * dtan(meccaLat) - dsin(latitude) * dcos(meccaLng - longitude);
  let qibla = darctan2(y, x);
  return (qibla + 360) % 360;
}
