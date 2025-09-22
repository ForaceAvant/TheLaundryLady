import React, { useMemo, useState } from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import emailjs from "@emailjs/browser";

// ---- EmailJS IDs ----
const SERVICE_ID = "service_dhrbhlp";
const ADMIN_TEMPLATE_ID = "template_m6v1doi";
const CUSTOMER_TEMPLATE_ID = "template_tif28mp";
const PUBLIC_KEY = "UUld8pP5oByCPy8tf";

const PRICING = {
  pricePerPound: 1.85,     // charge by weight
  pressingPerItem: 1.25,   // per pressed item
};

const fmt = (n) => `$${Number(n).toFixed(2)}`;

export default function OrderForm() {

  const TIME_WINDOW = { startHour: 7, endHour: 21, stepMin: 15 }; // 7:00 -> 21:00 (9 PM)

function to12h(hhmm) {
  if (!hhmm) return "";
  const [h, m] = hhmm.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${m.toString().padStart(2, "0")} ${ampm}`;
}

function generateTimeSlots({ startHour, endHour, stepMin }) {
  const out = [];
  for (let minutes = startHour * 60; minutes <= endHour * 60; minutes += stepMin) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    const value = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`; // "HH:MM"
    out.push({ value, label: to12h(value) });
  }
  return out;
}

  // Contact / pickup
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState(""); // 15-min increments via step

  // Service choices
  const [detergentType, setDetergentType] = useState("Scented"); // "Scented" | "Unscented"
  const [estimatedWeight, setEstimatedWeight] = useState(10);    // lbs
  const [pressingEnabled, setPressingEnabled] = useState(false);
  const [pressingItems, setPressingItems] = useState(0);

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Pricing breakdown (estimated)
  const breakdown = useMemo(() => {
    const weight = Math.max(0, Number(estimatedWeight) || 0);
    const pressCount = pressingEnabled ? Math.max(0, Number(pressingItems) || 0) : 0;

    const weightSubtotal = weight * PRICING.pricePerPound;
    const pressingSubtotal = pressCount * PRICING.pressingPerItem;
    const total = weightSubtotal + pressingSubtotal;

    

    return {
      lines: [
        { label: `Laundry (by weight) — ${weight.toFixed(1)} lb @ ${fmt(PRICING.pricePerPound)}/lb`, amount: weightSubtotal },
        ...(pressCount > 0
          ? [{ label: `Pressing — ${pressCount} item(s) @ ${fmt(PRICING.pressingPerItem)}/item`, amount: pressingSubtotal }]
          : []),
      ],
      total,
    };
  }, [estimatedWeight, pressingEnabled, pressingItems]);

  const navigate = useNavigate();

  const handleBack = () => {
    // If user came from another page, go back; otherwise send to landing
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  };

  const validate = () => {
    if (!name.trim()) return "Please enter your full name.";
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) return "Please enter a valid email.";
    if (!phone.trim()) return "Please enter your phone number.";
    if (!pickupAddress.trim()) return "Please enter a pickup address.";
    if (!dropoffAddress.trim()) return "Please enter a drop-off address.";
    if (!pickupDate) return "Please choose a pickup date.";
    if (!pickupTime) return "Please choose a pickup time.";
    const w = Number(estimatedWeight);
    if (isNaN(w) || w <= 0) return "Please enter a positive estimated weight (in pounds).";
    if (pressingEnabled) {
      const p = Number(pressingItems);
      if (isNaN(p) || p < 0) return "Pressing items must be 0 or more.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    const err = validate();
    if (err) {
      setErrorMsg(err);
      return;
    }

    setSubmitting(true);

    // Build HTML summary
    const rowsHtml = breakdown.lines
      .map(
        (l) =>
          `<tr><td style="padding:6px 8px">${l.label}</td><td style="padding:6px 8px;text-align:right">${fmt(
            l.amount
          )}</td></tr>`
      )
      .join("");

    const summaryHtml = `
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#333">
        <h3 style="margin:0 0 10px">Laundry Order — The Laundry Lady</h3>
        <p style="margin:0 0 8px">
          <strong>Name:</strong> ${name}<br/>
          <strong>Email:</strong> ${email}<br/>
          <strong>Phone:</strong> ${phone}
        </p>
        <p style="margin:0 0 8px">
          <strong>Pickup:</strong> ${pickupAddress}<br/>
          <strong>Drop-off:</strong> ${dropoffAddress}<br/>
          <strong>When:</strong> ${pickupDate} at ${to12h(pickupTime)}
        </p>
        <p style="margin:0 0 8px">
          <strong>Detergent:</strong> ${detergentType}<br/>
          <strong>Estimated Weight:</strong> ${Number(estimatedWeight).toFixed(1)} lb
          ${pressingEnabled ? `<br/><strong>Pressing Items:</strong> ${pressingItems}` : ""}
        </p>
        <h4 style="margin:14px 0 6px">Estimated Pricing</h4>
        <table style="border-collapse:collapse;width:100%;max-width:460px">
          <tbody>
            ${rowsHtml}
            <tr>
              <td style="padding:8px 8px;border-top:1px solid #ddd"><strong>Estimated Total</strong></td>
              <td style="padding:8px 8px;border-top:1px solid #ddd;text-align:right"><strong>${fmt(
                breakdown.total
              )}</strong></td>
            </tr>
          </tbody>
        </table>
        <p style="margin:10px 0 0;color:#666">
          Final total is based on actual weight measured after pickup. Pressing is charged per item.
        </p>
      </div>
    `;

    const templateParamsAdmin = {
      name,
      email,
      phone,
      pickup_address: pickupAddress,
      dropoff_address: dropoffAddress,
      pickup_date: pickupDate,
      pickup_time: pickupTime,
      detergent_type: detergentType, // "Scented" | "Unscented"
      estimated_weight_lbs: Number(estimatedWeight).toFixed(1),
      price_per_lb: fmt(PRICING.pricePerPound),
      pressing_items: pressingEnabled ? String(pressingItems) : "0",
      pressing_price_each: fmt(PRICING.pressingPerItem),
      estimated_total: fmt(breakdown.total),
      pricing_html: summaryHtml,
      reply_to: email,
    };

    const templateParamsCustomer = {
      ...templateParamsAdmin,
      customer_email: email, // Make sure your Customer template "To" = {{customer_email}}
    };

    try {
      emailjs.init(PUBLIC_KEY);
      await emailjs.send(SERVICE_ID, ADMIN_TEMPLATE_ID, templateParamsAdmin);
      await emailjs.send(SERVICE_ID, CUSTOMER_TEMPLATE_ID, templateParamsCustomer);
      setSuccessMsg("Thanks! Your request was submitted. A confirmation email is on its way.");
    } catch (errSend) {
      console.error(errSend);
      setErrorMsg("We couldn’t send your request right now. Please try again shortly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
      {/* Back button */}
      <Button
        onClick={handleBack}
        startIcon={<ArrowBackIosNewIcon />}
        variant="text"
        sx={{
          alignSelf: "flex-start",
          mb: 1.5,
          color: "text.secondary",
          "&:hover": { color: "primary.main" },
        }}
      >
        Back
      </Button>
      {/* Brand mark */}
      <Typography
        sx={{
          fontFamily: '"Great Vibes", cursive',
          fontSize: { xs: 36, md: 48 },
          color: "primary.main",
          textAlign: "center",
          mb: 1,
          lineHeight: 1,
        }}
      >
        The Laundry Lady
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 800, textAlign: "center", mb: 1 }}>
        Laundry Order Form
      </Typography>
      <Typography color="text.secondary" sx={{ textAlign: "center", mb: 3 }}>
        Pricing is by the pound. Scented or unscented detergent. Optional pressing per item.
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Left column: Options */}
          <Grid item xs={12} md={7}>
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Preferences
                </Typography>

                <Grid container spacing={2}>
                  {/* Detergent type */}
                  <Grid item xs={12}>
                    <FormControl>
                      <FormLabel>Detergent</FormLabel>
                      <RadioGroup
                        row
                        value={detergentType}
                        onChange={(e) => setDetergentType(e.target.value)}
                      >
                        <FormControlLabel value="Scented" control={<Radio />} label="Scented" />
                        <FormControlLabel value="Unscented" control={<Radio />} label="Unscented (Free & Clear)" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>

                  {/* Estimated weight */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Estimated Weight (lb)"
                      type="number"
                      inputProps={{ step: 0.5, min: 0 }}
                      fullWidth
                      value={estimatedWeight}
                      onChange={(e) => setEstimatedWeight(e.target.value)}
                    />
                  </Grid>

                  {/* Pressing */}
                  <Grid item xs={12} sm={6}>
                    <FormControl>
                      <FormLabel>Pressing</FormLabel>
                      <RadioGroup
                        row
                        value={pressingEnabled ? "yes" : "no"}
                        onChange={(e) => setPressingEnabled(e.target.value === "yes")}
                      >
                        <FormControlLabel value="no" control={<Radio />} label="No" />
                        <FormControlLabel value="yes" control={<Radio />} label={`Yes (${fmt(PRICING.pressingPerItem)}/item)`} />
                      </RadioGroup>
                    </FormControl>
                  </Grid>

                  {pressingEnabled && (
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Items to press"
                        type="number"
                        inputProps={{ step: 1, min: 0 }}
                        fullWidth
                        value={pressingItems}
                        onChange={(e) => setPressingItems(e.target.value)}
                      />
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Right column: Pricing */}
          

          {/* Contact & pickup */}
          <Grid item xs={12}>
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Contact & Pickup
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Full Name"
                      fullWidth
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Email"
                      type="email"
                      fullWidth
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Phone"
                      fullWidth
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Pickup Address"
                      fullWidth
                      required
                      value={pickupAddress}
                      onChange={(e) => setPickupAddress(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Drop-off Address"
                      fullWidth
                      required
                      value={dropoffAddress}
                      onChange={(e) => setDropoffAddress(e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Pickup Date"
                      type="date"
                      fullWidth
                      required
                      InputLabelProps={{ shrink: true }}
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
  label="Pickup Time"
  select
  fullWidth
  required
  value={pickupTime}
  onChange={(e) => setPickupTime(e.target.value)}
  helperText="Choose a 15-minute slot"
>
  <MenuItem disabled value="">
    Select a time…
  </MenuItem>
  {generateTimeSlots(TIME_WINDOW).map((opt) => (
    <MenuItem key={opt.value} value={opt.value}>
      {opt.label}
    </MenuItem>
  ))}
</TextField>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={5}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: 3,
                position: { md: "sticky" },
                top: { md: 24 },
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Estimated Pricing
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  Final price is based on actual weight after pickup.
                </Typography>

                <Stack spacing={1.25}>
                  {breakdown.lines.map((l, i) => (
                    <Stack key={i} direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2">{l.label}</Typography>
                      <Typography variant="body2" fontWeight={700}>{fmt(l.amount)}</Typography>
                    </Stack>
                  ))}
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1" fontWeight={800}>Estimated Total</Typography>
                  <Typography variant="subtitle1" fontWeight={800}>{fmt(breakdown.total)}</Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Submit */}
          <Grid item xs={12}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={submitting}
                sx={{ borderRadius: 2, px: 3, py: 1.3 }}
              >
                {submitting ? "Submitting..." : "Submit & Send Confirmation"}
              </Button>
              <Typography variant="body2" color="text.secondary">
                You’ll receive a confirmation email with your selections and estimate.
              </Typography>
            </Stack>

            {successMsg && (
              <Alert severity="success" sx={{ mt: 2 }}>
                {successMsg}
              </Alert>
            )}
            {errorMsg && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {errorMsg}
              </Alert>
            )}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
