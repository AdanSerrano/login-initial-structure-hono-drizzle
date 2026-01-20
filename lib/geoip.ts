/**
 * GeoIP Service using ip-api.com (free tier)
 * Provides location information based on IP address
 */

export interface GeoLocation {
  country: string | null;
  countryCode: string | null;
  city: string | null;
  region: string | null;
  timezone: string | null;
  isp: string | null;
}

interface IpApiResponse {
  status: 'success' | 'fail';
  country?: string;
  countryCode?: string;
  city?: string;
  regionName?: string;
  timezone?: string;
  isp?: string;
  message?: string;
}

const IP_API_URL = 'http://ip-api.com/json';

/**
 * Get geolocation information from an IP address
 * Note: ip-api.com free tier has a rate limit of 45 requests per minute
 */
export async function getGeoLocation(ipAddress: string): Promise<GeoLocation | null> {
  // Skip for localhost/private IPs
  if (isPrivateOrLocalIP(ipAddress)) {
    return {
      country: 'Local',
      countryCode: 'LOCAL',
      city: 'Localhost',
      region: null,
      timezone: null,
      isp: null,
    };
  }

  try {
    const response = await fetch(`${IP_API_URL}/${ipAddress}?fields=status,message,country,countryCode,regionName,city,timezone,isp`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('GeoIP API error:', response.statusText);
      return null;
    }

    const data: IpApiResponse = await response.json();

    if (data.status === 'fail') {
      console.error('GeoIP lookup failed:', data.message);
      return null;
    }

    return {
      country: data.country || null,
      countryCode: data.countryCode || null,
      city: data.city || null,
      region: data.regionName || null,
      timezone: data.timezone || null,
      isp: data.isp || null,
    };
  } catch (error) {
    console.error('GeoIP lookup error:', error);
    return null;
  }
}

/**
 * Check if an IP address is private or localhost
 */
function isPrivateOrLocalIP(ip: string): boolean {
  if (!ip || ip === 'unknown') return true;

  // Localhost
  if (ip === '127.0.0.1' || ip === '::1' || ip === 'localhost') return true;

  // Private IP ranges
  const privateRanges = [
    /^10\./,                          // 10.0.0.0 - 10.255.255.255
    /^172\.(1[6-9]|2[0-9]|3[01])\./,  // 172.16.0.0 - 172.31.255.255
    /^192\.168\./,                    // 192.168.0.0 - 192.168.255.255
    /^169\.254\./,                    // Link-local
    /^fc00:/i,                        // IPv6 private
    /^fe80:/i,                        // IPv6 link-local
  ];

  return privateRanges.some(range => range.test(ip));
}

/**
 * Format location for display
 */
export function formatLocation(location: GeoLocation | null): string {
  if (!location) return 'Ubicación desconocida';

  if (location.countryCode === 'LOCAL') return 'Red local';

  const parts: string[] = [];
  if (location.city) parts.push(location.city);
  if (location.country) parts.push(location.country);

  return parts.length > 0 ? parts.join(', ') : 'Ubicación desconocida';
}

/**
 * Check if two locations are significantly different
 */
export function isLocationDifferent(
  location1: GeoLocation | null,
  location2: GeoLocation | null
): boolean {
  // If either location is unknown, we can't determine if they're different
  if (!location1 || !location2) return false;

  // Skip for local IPs
  if (location1.countryCode === 'LOCAL' || location2.countryCode === 'LOCAL') return false;

  // Different country is definitely suspicious
  if (location1.countryCode !== location2.countryCode) return true;

  // Different city within the same country (could be VPN or travel)
  if (location1.city && location2.city && location1.city !== location2.city) {
    return true;
  }

  return false;
}
