/**
 * Email template helpers for booking notifications.
 */

/**
 * Email sent to the user when their booking is confirmed.
 */
export function bookingConfirmationUserEmail({ userName, venueName, startTime, endTime, totalCost, bookingId }) {
  const start = new Date(startTime).toLocaleString("en-IN", {
    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
  const end = new Date(endTime).toLocaleString("en-IN", {
    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
  });

  return {
    subject: `Booking Confirmed – ${venueName}`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f7f7f7; margin: 0; padding: 24px;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08);">
          <tr>
            <td style="background: #111; padding: 24px; text-align: center;">
              <h1 style="color: #fff; margin: 0; font-size: 20px; font-weight: 600;">✅ Booking Confirmed</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 24px;">
              <p style="font-size: 16px; color: #333; margin: 0 0 16px;">Hi <strong>${userName}</strong>,</p>
              <p style="font-size: 14px; color: #555; margin: 0 0 20px;">Your booking at <strong>${venueName}</strong> has been confirmed!</p>

              <table width="100%" cellpadding="0" cellspacing="0" style="background: #f7f7f7; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
                <tr><td style="font-size: 12px; color: #888; padding-bottom: 4px;">CHECK-IN</td></tr>
                <tr><td style="font-size: 15px; font-weight: 600; color: #111; padding-bottom: 12px;">${start}</td></tr>
                <tr><td style="font-size: 12px; color: #888; padding-bottom: 4px;">CHECK-OUT</td></tr>
                <tr><td style="font-size: 15px; font-weight: 600; color: #111; padding-bottom: 12px;">${end}</td></tr>
                <tr><td style="font-size: 12px; color: #888; padding-bottom: 4px;">TOTAL CHARGED</td></tr>
                <tr><td style="font-size: 18px; font-weight: 700; color: #111;">₹${Number(totalCost).toLocaleString("en-IN")}</td></tr>
              </table>

              <p style="font-size: 13px; color: #888; margin: 0;">Booking reference: <strong>#${bookingId}</strong></p>
            </td>
          </tr>
          <tr>
            <td style="background: #f7f7f7; padding: 16px 24px; text-align: center;">
              <p style="font-size: 12px; color: #999; margin: 0;">VenueFinder – Your venue booking platform</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  };
}

/**
 * Email sent to the host when a user's booking is confirmed.
 */
export function bookingConfirmationHostEmail({ hostName, userName, venueName, startTime, endTime, totalCost, bookingId }) {
  const start = new Date(startTime).toLocaleString("en-IN", {
    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
  const end = new Date(endTime).toLocaleString("en-IN", {
    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
  });

  return {
    subject: `New Booking – ${venueName}`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f7f7f7; margin: 0; padding: 24px;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08);">
          <tr>
            <td style="background: #111; padding: 24px; text-align: center;">
              <h1 style="color: #fff; margin: 0; font-size: 20px; font-weight: 600;">🎉 New Booking!</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 24px;">
              <p style="font-size: 16px; color: #333; margin: 0 0 16px;">Hi <strong>${hostName}</strong>,</p>
              <p style="font-size: 14px; color: #555; margin: 0 0 20px;"><strong>${userName}</strong> has booked <strong>${venueName}</strong>.</p>

              <table width="100%" cellpadding="0" cellspacing="0" style="background: #f7f7f7; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
                <tr><td style="font-size: 12px; color: #888; padding-bottom: 4px;">CHECK-IN</td></tr>
                <tr><td style="font-size: 15px; font-weight: 600; color: #111; padding-bottom: 12px;">${start}</td></tr>
                <tr><td style="font-size: 12px; color: #888; padding-bottom: 4px;">CHECK-OUT</td></tr>
                <tr><td style="font-size: 15px; font-weight: 600; color: #111; padding-bottom: 12px;">${end}</td></tr>
                <tr><td style="font-size: 12px; color: #888; padding-bottom: 4px;">BOOKING VALUE</td></tr>
                <tr><td style="font-size: 18px; font-weight: 700; color: #111;">₹${Number(totalCost).toLocaleString("en-IN")}</td></tr>
              </table>

              <p style="font-size: 13px; color: #888; margin: 0;">Booking reference: <strong>#${bookingId}</strong></p>
            </td>
          </tr>
          <tr>
            <td style="background: #f7f7f7; padding: 16px 24px; text-align: center;">
              <p style="font-size: 12px; color: #999; margin: 0;">VenueFinder – Your venue booking platform</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  };
}

/**
 * Email sent to the user when their booking is cancelled.
 */
export function bookingCancellationUserEmail({ userName, venueName, startTime, bookingId }) {
  const start = new Date(startTime).toLocaleString("en-IN", {
    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
  });

  return {
    subject: `Booking Cancelled – ${venueName}`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f7f7f7; margin: 0; padding: 24px;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08);">
          <tr>
            <td style="background: #c0392b; padding: 24px; text-align: center;">
              <h1 style="color: #fff; margin: 0; font-size: 20px; font-weight: 600;">Booking Cancelled</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 24px;">
              <p style="font-size: 16px; color: #333; margin: 0 0 16px;">Hi <strong>${userName}</strong>,</p>
              <p style="font-size: 14px; color: #555; margin: 0 0 20px;">Your booking at <strong>${venueName}</strong> has been cancelled as requested.</p>

              <table width="100%" cellpadding="0" cellspacing="0" style="background: #f7f7f7; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
                <tr><td style="font-size: 12px; color: #888; padding-bottom: 4px;">SCHEDULED</td></tr>
                <tr><td style="font-size: 15px; font-weight: 600; color: #111;">${start}</td></tr>
                <tr><td style="font-size: 12px; color: #888; padding-top: 8px;">Booking reference: <strong>#${bookingId}</strong></td></tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background: #f7f7f7; padding: 16px 24px; text-align: center;">
              <p style="font-size: 12px; color: #999; margin: 0;">VenueFinder – Your venue booking platform</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  };
}
