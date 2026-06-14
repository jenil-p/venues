"use client";

import { useState, useEffect, useCallback } from "react";
import { bookingService } from "@/api/booking.service";
import { FaStar, FaChevronLeft, FaChevronRight, FaSpinner } from "react-icons/fa";
import { MdClose } from "react-icons/md";

const SERVICE_FEE = 2500; // just temporarily...  can remove this

const MONTHS = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
];
const DAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"];

function isSameDay(a, b) {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth()    === b.getMonth()    &&
        a.getDate()     === b.getDate()
    );
}

function startOfDay(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}

function addDays(date, n) {
    const d = new Date(date);
    d.setDate(d.getDate() + n);
    return d;
}

function daysBetween(a, b) {
    return Math.round((startOfDay(b) - startOfDay(a)) / 86400000);
}

function isDayBlocked(day, blockedSlots) {
    const d = startOfDay(day);
    return blockedSlots.some(({ startTime, endTime }) => {
        const s = startOfDay(new Date(startTime));
        const e = startOfDay(new Date(endTime));
        return d >= s && d < e;
    });
}

function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year, month) {
    return new Date(year, month, 1).getDay();
}

// calender

function Calendar({
    year, month, onMonthChange,
    checkIn, checkOut, hoverDay,
    onDayClick, onDayHover,
    blockedSlots,
    minDate,
}) {
    const daysInMonth  = getDaysInMonth(year, month);
    const firstDayOfWeek = getFirstDayOfWeek(year, month);
    const today = startOfDay(new Date());

    const cells = [];
    for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

    function classFor(day) {
        if (!day) return "";
        const d = startOfDay(day);
        const isPast    = d < today;
        const isMin     = minDate && d < startOfDay(minDate);
        const blocked   = isDayBlocked(day, blockedSlots);
        const disabled  = isPast || blocked || (isMin);

        const isStart   = checkIn  && isSameDay(day, checkIn);
        const isEnd     = checkOut && isSameDay(day, checkOut);
        const isHover   = hoverDay && checkIn && !checkOut && isSameDay(day, hoverDay);

        const inRange   = checkIn && (checkOut || hoverDay) && (
            d > startOfDay(checkIn) &&
            d < startOfDay(checkOut || hoverDay)
        );

        let cls = "cal-day";
        if (disabled) cls += " cal-disabled";
        if (isStart)  cls += " cal-start";
        if (isEnd)    cls += " cal-end";
        if (isHover)  cls += " cal-hover";
        if (inRange)  cls += " cal-range";
        if (!disabled && !isStart && !isEnd) cls += " cal-hoverable";
        return cls;
    }

    return (
        <div className="calendar">
            <div className="cal-header">
                <button
                    className="cal-nav"
                    onClick={() => onMonthChange(-1)}
                    aria-label="Previous month"
                >
                    <FaChevronLeft size={12} />
                </button>
                <span className="cal-title">{MONTHS[month]} {year}</span>
                <button
                    className="cal-nav"
                    onClick={() => onMonthChange(1)}
                    aria-label="Next month"
                >
                    <FaChevronRight size={12} />
                </button>
            </div>

            <div className="cal-grid cal-days-row">
                {DAYS.map(d => <span key={d} className="cal-dayname">{d}</span>)}
            </div>

            <div className="cal-grid">
                {cells.map((day, i) => (
                    <button
                        key={i}
                        className={classFor(day)}
                        disabled={!day || isDayBlocked(day, blockedSlots) || startOfDay(day) < today || (minDate && startOfDay(day) < startOfDay(minDate))}
                        onClick={() => day && onDayClick(day)}
                        onMouseEnter={() => day && onDayHover(day)}
                        onMouseLeave={() => onDayHover(null)}
                        aria-label={day ? day.toDateString() : undefined}
                    >
                        {day ? day.getDate() : ""}
                    </button>
                ))}
            </div>
        </div>
    );
}

// price breakdown

function PriceBreakdown({ price, checkIn, checkOut, unit }) {
    if (!checkIn || !checkOut) return null;
    const nights = daysBetween(checkIn, checkOut);
    if (nights <= 0) return null;
    const unitLabel = unit === "HOURLY" ? "hr" : "day";
    const base = price * nights;
    const total = base + SERVICE_FEE;

    return (
        <div className="breakdown">
            <div className="breakdown-row">
                <span>₹{price.toLocaleString("en-IN")} × {nights} {nights === 1 ? unitLabel : unitLabel + "s"}</span>
                <span>₹{base.toLocaleString("en-IN")}</span>
            </div>
            <div className="breakdown-row">
                <span className="underline cursor-pointer">Service fee</span>
                <span>₹{SERVICE_FEE.toLocaleString("en-IN")}</span>
            </div>
            <div className="breakdown-total">
                <span>Total</span>
                <span>₹{total.toLocaleString("en-IN")}</span>
            </div>
        </div>
    );
}

// Main Widget

export default function BookingWidget({ price, rating, venueId, unit = "DAILY" }) {
    const today = new Date();

    const [calOpen,   setCalOpen]   = useState(false);
    const [selecting, setSelecting] = useState("checkIn"); // "checkIn" | "checkOut"
    const [checkIn,   setCheckIn]   = useState(null);
    const [checkOut,  setCheckOut]  = useState(null);
    const [hoverDay,  setHoverDay]  = useState(null);
    const [guests,    setGuests]    = useState(1);
    const [guestOpen, setGuestOpen] = useState(false);

    const [calYear,  setCalYear]  = useState(today.getFullYear());
    const [calMonth, setCalMonth] = useState(today.getMonth());

    const [blockedSlots, setBlockedSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);

    const [bookingState, setBookingState] = useState("idle");
    const [bookingError, setBookingError] = useState(null);

    const fetchAvailability = useCallback(async (year, month) => {
        if (!venueId) return;
        setLoadingSlots(true);
        try {
            const res = await bookingService.getAvailability(venueId, year, month + 1);
            setBlockedSlots(prev => {
                const existing = prev.filter(s => {
                    const d = new Date(s.startTime);
                    return !(d.getFullYear() === year && d.getMonth() === month);
                });
                return [...existing, ...(res.blockedSlots || [])];
            });
        } catch {

        } finally {
            setLoadingSlots(false);
        }
    }, [venueId]);

    useEffect(() => {
        if (calOpen) fetchAvailability(calYear, calMonth);
    }, [calOpen, calYear, calMonth, fetchAvailability]);

    function handleMonthChange(delta) {
        let m = calMonth + delta;
        let y = calYear;
        if (m > 11) { m = 0;  y++; }
        if (m < 0)  { m = 11; y--; }
        setCalMonth(m);
        setCalYear(y);
    }

    function handleDayClick(day) {
        if (selecting === "checkIn") {
            setCheckIn(day);
            setCheckOut(null);
            setSelecting("checkOut");
        } else {
            if (startOfDay(day) <= startOfDay(checkIn)) {
                setCheckIn(day);
                setCheckOut(null);
                setSelecting("checkOut");
                return;
            }
            
            const s = startOfDay(checkIn);
            const e = startOfDay(day);
            let cursor = addDays(s, 1);
            let hasBlock = false;
            while (cursor < e) {
                if (isDayBlocked(cursor, blockedSlots)) { hasBlock = true; break; }
                cursor = addDays(cursor, 1);
            }
            if (hasBlock) {
                setCheckIn(day);
                setCheckOut(null);
                setSelecting("checkOut");
                return;
            }
            setCheckOut(day);
            setSelecting("checkIn");
            setCalOpen(false);
        }
    }

    function clearDates() {
        setCheckIn(null);
        setCheckOut(null);
        setSelecting("checkIn");
    }

    async function handleReserve() {
        if (!checkIn || !checkOut) {
            setCalOpen(true);
            return;
        }
        setBookingState("loading");
        setBookingError(null);
        try {
            await bookingService.createBooking(venueId, {
                noOfGuest: guests,
                startTime: checkIn,
                endTime:   checkOut,
            });
            setBookingState("success");
        } catch (err) {
            const msg = err?.response?.data?.message || "Something went wrong. Please try again.";
            setBookingError(msg);
            setBookingState("error");
        }
    }

    const nights = checkIn && checkOut ? daysBetween(checkIn, checkOut) : 0;
    const unitLabel = unit === "HOURLY" ? "hour" : "day";
    const formattedPrice = Number(price).toLocaleString("en-IN");

    const formatDate = (d) =>
        d ? d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : null;

    if (bookingState === "success") {
        return (
            <>
                <style>{widgetStyles}</style>
                <div className="widget success-state">
                    <div className="success-icon">✓</div>
                    <h3 className="success-title">Booking Requested!</h3>
                    <p className="success-sub">
                        Your request has been submitted. You'll hear back from the venue shortly.
                    </p>
                    <div className="success-dates">
                        <span>{formatDate(checkIn)}</span>
                        <span className="arrow">→</span>
                        <span>{formatDate(checkOut)}</span>
                    </div>
                    <button
                        className="reserve-btn"
                        onClick={() => { setBookingState("idle"); clearDates(); }}
                    >
                        Book another date
                    </button>
                </div>
            </>
        );
    }

    return (
        <>
            <style>{widgetStyles}</style>

            <div className="widget">
                {/* Price header */}
                <div className="widget-header">
                    <div className="price-line">
                        <span className="price-amount">₹{formattedPrice}</span>
                        <span className="price-unit"> / {unitLabel}</span>
                    </div>
                    {rating && (
                        <div className="rating-pill">
                            <FaStar size={11} />
                            <span>{Number(rating).toFixed(1)}</span>
                        </div>
                    )}
                </div>

                {/* Date picker trigger */}
                <div
                    className={`date-box ${calOpen ? "date-box--open" : ""}`}
                    onClick={() => setCalOpen(!calOpen)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === "Enter" && setCalOpen(!calOpen)}
                >
                    <div className={`date-cell ${selecting === "checkIn" && calOpen ? "date-cell--active" : ""}`}>
                        <span className="date-label">CHECK-IN</span>
                        <span className="date-value">{formatDate(checkIn) || "Add date"}</span>
                    </div>
                    <div className="date-divider" />
                    <div className={`date-cell ${selecting === "checkOut" && calOpen ? "date-cell--active" : ""}`}
                        onClick={e => { e.stopPropagation(); if (checkIn) { setSelecting("checkOut"); setCalOpen(true); } }}>
                        <span className="date-label">CHECK-OUT</span>
                        <span className="date-value">{formatDate(checkOut) || "Add date"}</span>
                    </div>
                </div>

                {/* Calendar dropdown */}
                {calOpen && (
                    <div className="cal-dropdown">
                        <div className="cal-dropdown-header">
                            <div>
                                <p className="cal-prompt">
                                    {!checkIn
                                        ? "Select check-in date"
                                        : !checkOut
                                        ? "Select check-out date"
                                        : `${nights} ${nights === 1 ? unitLabel : unitLabel + "s"} selected`}
                                </p>
                                {(checkIn || checkOut) && (
                                    <button className="clear-btn" onClick={clearDates}>Clear dates</button>
                                )}
                            </div>
                            <button className="cal-close" onClick={() => setCalOpen(false)} aria-label="Close calendar">
                                <MdClose size={18} />
                            </button>
                        </div>

                        {loadingSlots && (
                            <div className="cal-loading">
                                <FaSpinner className="spin" size={14} />
                                <span>Loading availability...</span>
                            </div>
                        )}

                        <Calendar
                            year={calYear}
                            month={calMonth}
                            onMonthChange={handleMonthChange}
                            checkIn={checkIn}
                            checkOut={checkOut}
                            hoverDay={hoverDay}
                            onDayClick={handleDayClick}
                            onDayHover={setHoverDay}
                            blockedSlots={blockedSlots}
                            minDate={selecting === "checkOut" ? addDays(checkIn, 1) : today}
                        />

                        <div className="cal-legend">
                            <span className="legend-item"><span className="legend-dot legend-blocked" />Unavailable</span>
                            <span className="legend-item"><span className="legend-dot legend-selected" />Selected</span>
                        </div>
                    </div>
                )}

                {/* Guests */}
                <div className="guests-box" onClick={() => setGuestOpen(!guestOpen)} role="button" tabIndex={0}>
                    <span className="date-label">GUESTS</span>
                    <div className="guests-row">
                        <span className="date-value">{guests} guest{guests > 1 ? "s" : ""}</span>
                        <span className="chevron">{guestOpen ? "▲" : "▼"}</span>
                    </div>
                </div>

                {guestOpen && (
                    <div className="guests-dropdown">
                        <div className="guests-control-row">
                            <div>
                                <p className="guests-type">Guests</p>
                            </div>
                            <div className="guests-stepper">
                                <button
                                    className="stepper-btn"
                                    onClick={() => setGuests(g => Math.max(1, g - 1))}
                                    disabled={guests <= 1}
                                    aria-label="Remove guest"
                                >
                                    −
                                </button>
                                <span className="stepper-count">{guests}</span>
                                <button
                                    className="stepper-btn"
                                    onClick={() => setGuests(g => g + 1)}
                                    aria-label="Add guest"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        <button className="close-guests-btn" onClick={() => setGuestOpen(false)}>Close</button>
                    </div>
                )}

                {/* Reserve button */}
                <button
                    className={`reserve-btn ${bookingState === "loading" ? "reserve-btn--loading" : ""}`}
                    onClick={handleReserve}
                    disabled={bookingState === "loading"}
                >
                    {bookingState === "loading"
                        ? <><FaSpinner className="spin" /> Reserving...</>
                        : checkIn && checkOut ? "Reserve" : "Check availability"}
                </button>

                {!checkIn && (
                    <p className="no-charge-note">You won't be charged yet</p>
                )}

                {/* Error message */}
                {bookingState === "error" && bookingError && (
                    <div className="booking-error">
                        <span>{bookingError}</span>
                        <button onClick={() => setBookingState("idle")} aria-label="Dismiss"><MdClose size={14}/></button>
                    </div>
                )}

                {/* Price breakdown */}
                <PriceBreakdown
                    price={Number(price)}
                    checkIn={checkIn}
                    checkOut={checkOut}
                    unit={unit}
                />
            </div>
        </>
    );
}

// Styles

const widgetStyles = `
.widget {
    border: 1px solid #e0e0e0;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 2px 16px rgba(0,0,0,0.10);
    background: #fff;
    font-family: inherit;
    position: relative;
}
.widget-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}
.price-line { display: flex; align-items: baseline; gap: 2px; }
.price-amount { font-size: 22px; font-weight: 700; color: #111; }
.price-unit   { font-size: 14px; color: #555; }
.rating-pill  {
    display: flex; align-items: center; gap: 4px;
    font-size: 13px; font-weight: 600; color: #111;
}

/* Date box */
.date-box {
    border: 1px solid #b0b0b0;
    border-radius: 10px;
    display: grid;
    grid-template-columns: 1fr 1px 1fr;
    cursor: pointer;
    overflow: hidden;
    margin-bottom: 0;
    transition: border-color 0.15s;
}
.date-box--open { border-color: #111; }
.date-cell {
    padding: 10px 14px;
    display: flex; flex-direction: column; gap: 2px;
    transition: background 0.12s;
}
.date-cell--active { background: #f5f5f5; }
.date-divider { background: #b0b0b0; width: 1px; }
.date-label { font-size: 10px; font-weight: 700; color: #555; letter-spacing: 0.06em; }
.date-value { font-size: 13px; color: #111; font-weight: 500; }

/* Guests box */
.guests-box {
    border: 1px solid #b0b0b0;
    border-top: none;
    border-radius: 0 0 10px 10px;
    padding: 10px 14px;
    cursor: pointer;
    margin-bottom: 14px;
    transition: border-color 0.15s;
}
.guests-row { display: flex; justify-content: space-between; align-items: center; }
.chevron { font-size: 10px; color: #555; }

/* Guests dropdown */
.guests-dropdown {
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    padding: 16px;
    margin-bottom: 14px;
    background: #fff;
    box-shadow: 0 4px 20px rgba(0,0,0,0.10);
}
.guests-control-row {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 16px;
}
.guests-type { font-size: 14px; font-weight: 600; color: #111; margin: 0; }
.guests-stepper { display: flex; align-items: center; gap: 14px; }
.stepper-btn {
    width: 32px; height: 32px;
    border-radius: 50%; border: 1px solid #b0b0b0;
    background: #fff; font-size: 18px; font-weight: 300;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #111; line-height: 1;
    transition: background 0.12s, border-color 0.12s;
}
.stepper-btn:hover:not(:disabled) { border-color: #111; }
.stepper-btn:disabled { color: #ccc; border-color: #e0e0e0; cursor: not-allowed; }
.stepper-count { font-size: 15px; font-weight: 500; min-width: 20px; text-align: center; }
.close-guests-btn {
    font-size: 13px; font-weight: 600; text-decoration: underline;
    background: none; border: none; cursor: pointer; color: #111; padding: 0;
    float: right;
}

/* Calendar dropdown */
.cal-dropdown {
    border: 1px solid #e0e0e0;
    border-radius: 14px;
    padding: 16px;
    margin: 8px 0 12px;
    background: #fff;
    box-shadow: 0 6px 30px rgba(0,0,0,0.12);
}
.cal-dropdown-header {
    display: flex; justify-content: space-between; align-items: flex-start;
    margin-bottom: 12px;
}
.cal-prompt { font-size: 15px; font-weight: 600; color: #111; margin: 0 0 2px; }
.clear-btn {
    font-size: 12px; text-decoration: underline; color: #555;
    background: none; border: none; cursor: pointer; padding: 0;
    font-weight: 500;
}
.cal-close {
    background: none; border: none; cursor: pointer; color: #555;
    padding: 2px; border-radius: 50%;
    display: flex; align-items: center;
    transition: background 0.12s;
}
.cal-close:hover { background: #f0f0f0; }
.cal-loading {
    display: flex; align-items: center; gap: 6px;
    font-size: 12px; color: #888; margin-bottom: 8px;
}

/* Calendar */
.calendar { user-select: none; }
.cal-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 10px; padding: 0 2px;
}
.cal-title { font-size: 14px; font-weight: 600; color: #111; }
.cal-nav {
    background: none; border: none; cursor: pointer;
    padding: 6px; border-radius: 50%; color: #111;
    display: flex; align-items: center;
    transition: background 0.12s;
}
.cal-nav:hover { background: #f0f0f0; }
.cal-grid {
    display: grid; grid-template-columns: repeat(7, 1fr);
    gap: 2px;
}
.cal-days-row { margin-bottom: 4px; }
.cal-dayname {
    text-align: center; font-size: 11px; font-weight: 600;
    color: #888; padding: 4px 0;
}
.cal-day {
    aspect-ratio: 1;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 400; color: #111;
    border-radius: 50%; border: none; background: transparent;
    cursor: default; transition: background 0.1s, color 0.1s;
    min-width: 0;
}
.cal-hoverable { cursor: pointer; }
.cal-hoverable:hover { background: #f0f0f0; }
.cal-disabled { color: #ccc; text-decoration: line-through; cursor: not-allowed; }
.cal-start, .cal-end {
    background: #111 !important; color: #fff !important;
    font-weight: 600; border-radius: 50%;
}
.cal-hover {
    background: #555 !important; color: #fff !important;
    border-radius: 50%;
}
.cal-range {
    background: #f0f0f0; border-radius: 0;
    color: #111;
}

.cal-legend {
    display: flex; gap: 16px; margin-top: 10px; padding-top: 10px;
    border-top: 1px solid #f0f0f0;
}
.legend-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #555; }
.legend-dot {
    width: 12px; height: 12px; border-radius: 50%;
    display: inline-block;
}
.legend-blocked  { background: #e0e0e0; position: relative; overflow: hidden; }
.legend-selected { background: #111; }

/* Reserve button */
.reserve-btn {
    width: 100%;
    background: linear-gradient(135deg, #e31c5f, #c41859);
    color: #fff;
    border: none;
    border-radius: 10px;
    padding: 14px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: opacity 0.15s, transform 0.1s;
    margin-bottom: 12px;
}
.reserve-btn:hover:not(:disabled) { opacity: 0.93; transform: translateY(-1px); }
.reserve-btn:active:not(:disabled) { transform: translateY(0); }
.reserve-btn--loading { opacity: 0.75; }
.reserve-btn:disabled { cursor: not-allowed; }

.no-charge-note {
    text-align: center; font-size: 12px; color: #555;
    margin: -4px 0 12px; font-weight: 500;
}

/* Booking error */
.booking-error {
    background: #fff0f0; border: 1px solid #fcc;
    border-radius: 8px; padding: 10px 14px;
    font-size: 13px; color: #c0392b;
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 12px;
}
.booking-error button {
    background: none; border: none; cursor: pointer; color: #c0392b;
}

/* Price breakdown */
.breakdown {
    border-top: 1px solid #e8e8e8;
    padding-top: 14px;
    margin-top: 4px;
}
.breakdown-row {
    display: flex; justify-content: space-between;
    font-size: 14px; color: #111; margin-bottom: 8px;
}
.breakdown-total {
    display: flex; justify-content: space-between;
    font-size: 15px; font-weight: 700; color: #111;
    border-top: 1px solid #e8e8e8;
    padding-top: 12px; margin-top: 4px;
}

/* Success state */
.success-state { text-align: center; padding: 32px 24px; }
.success-icon {
    width: 52px; height: 52px; border-radius: 50%;
    background: #111; color: #fff;
    font-size: 24px; display: flex; align-items: center; justify-content: center;
    margin: 0 auto 16px;
}
.success-title { font-size: 20px; font-weight: 700; color: #111; margin: 0 0 8px; }
.success-sub   { font-size: 14px; color: #555; margin: 0 0 20px; }
.success-dates {
    display: flex; align-items: center; gap: 10px;
    justify-content: center;
    font-size: 13px; font-weight: 600; color: #111;
    background: #f7f7f7; border-radius: 10px;
    padding: 10px 16px; margin-bottom: 20px;
}
.success-dates .arrow { color: #888; }

/* Spinner */
.spin {
    animation: spin 0.8s linear infinite;
    display: inline-block;
}
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

/* Underline util */
.underline { text-decoration: underline; cursor: pointer; }
`;
