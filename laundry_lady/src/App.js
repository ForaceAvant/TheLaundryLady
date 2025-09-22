// src/LandingPage.jsx
import * as React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  AppBar, Box, Button, Card, CardContent, Container, Divider,
  Grid, Stack, Toolbar, Typography
} from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LocalLaundryServiceIcon from "@mui/icons-material/LocalLaundryService";
import ScheduleSendIcon from "@mui/icons-material/ScheduleSend";

import logoUrl from "./assets/laundry-lady-logo.png";

// OPTIONAL: import your own photos; or pass URLs via props later
import g1 from "./assets/gallery/1.jpg";
import g2 from "./assets/gallery/2.jpg";
import g3 from "./assets/gallery/3.jpg";
import g4 from "./assets/gallery/4.webp";

const gallery = [g1, g2, g3].filter(Boolean);

export default function LandingPage() {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* AppBar (frosted, minimal) */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "rgba(255,255,255,0.65)",
          backdropFilter: "blur(10px)",
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
        }}
      >
        <Toolbar sx={{ minHeight: 78 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              component="img"
              src={logoUrl}
              alt="The Laundry Lady logo"
              sx={{ width: 44, height: 44, objectFit: "contain", borderRadius: "50%" }}
            />
            <Typography
              variant="h4"
              sx={{
                fontFamily: '"Great Vibes", cursive',
                color: "primary.main",
                lineHeight: 1,
                letterSpacing: 0.5,
              }}
            >
              The Laundry Lady
            </Typography>
          </Stack>

          <Box sx={{ flexGrow: 1 }} />
          <Stack direction="row" spacing={1.5}>
            <Button component={RouterLink} to="/order" variant="contained" size="medium">
              Schedule a Pickup
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* HERO */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          background:
            "radial-gradient(1200px 700px at -10% -10%, rgba(182,106,217,0.10), transparent 60%)," +
            "radial-gradient(900px 600px at 110% 10%, rgba(247,199,218,0.40), transparent 55%)," +
            "linear-gradient(180deg, #FFF5F9 0%, #FFFFFF 100%)",
        }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
          <Grid container spacing={6} alignItems="center">
            {/* Left: Brand + CTA */}
            <Grid item xs={12} md={7}>
              <Stack spacing={3}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    component="img"
                    src={logoUrl}
                    alt="The Laundry Lady"
                    sx={{
                      width: { xs: 84, md: 104 },
                      height: { xs: 84, md: 104 },
                      objectFit: "cover",
                      borderRadius: "50%",
                      boxShadow: 2,
                    }}
                  />
                  <Typography
                    sx={{
                      fontFamily: '"Great Vibes", cursive',
                      fontSize: { xs: 48, md: 68 },
                      color: "primary.main",
                      lineHeight: 0.9,
                    }}
                  >
                    The Laundry Lady
                  </Typography>
                </Stack>

                <Typography
                  variant="h2"
                  sx={{
                    fontSize: { xs: 30, md: 46 },
                    fontWeight: 700,
                    letterSpacing: -0.4,
                    lineHeight: 1.15,
                    color: "text.primary",
                  }}
                >
                  Premium pickup & delivery —{" "}
                  <Box component="span" sx={{ color: "primary.main" }}>
                    handled with grace.
                  </Box>
                </Typography>

                <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 720 }}>
                  Choose your detergent and scent, add pressing if you’d like, and we’ll
                  return everything fresh, folded, and ready to wear.
                </Typography>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ pt: 1 }}>
                  <Button
                    component={RouterLink}
                    to="/order"
                    variant="contained"
                    size="large"
                  >
                    Schedule a Pickup
                  </Button>
                  <Button href="#how" variant="text" size="large">
                    How it works
                  </Button>
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ pt: 1.5 }}>
                  <FeatureChip icon={<CheckCircleRoundedIcon />} text="24–48h turnaround" />
                  <FeatureChip icon={<LocalShippingIcon />} text="Door-to-door service" />
                  <FeatureChip icon={<LocalLaundryServiceIcon />} text="Handled with care" />
                </Stack>
              </Stack>
            </Grid>

            {/* Right: Elegant card */}
            <Grid item xs={12} md={5}>
              <Card
                elevation={0}
                sx={{
                  border: (t) => `1px solid ${t.palette.divider}`,
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.75), rgba(255,255,255,0.95))",
                }}
              >
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Stack spacing={1.5}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <ScheduleSendIcon color="primary" />
                      <Typography variant="h6" fontWeight={700}>
                        Book in under a minute
                      </Typography>
                    </Stack>
                    <Typography color="text.secondary">
                      Select detergent (Tide, Gain, Persil…), pick your scent, toggle
                      pressing, and choose pickup time. We’ll confirm by email.
                    </Typography>
                    <Divider sx={{ my: 1.5 }} />
                    <Stack spacing={1}>
                      <Row text="Easy pickup window" />
                      <Row text="Pressing available" />
                      <Row text="Allergy-friendly options" />
                    </Stack>
                    <Button
                      component={RouterLink}
                      to="/order"
                      variant="outlined"
                      size="large"
                      fullWidth
                      sx={{ mt: 1 }}
                    >
                      Start your order
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Gallery strip (uses your generic laundry photos) */}
          {gallery.length > 0 && (
            <Box sx={{ mt: { xs: 6, md: 8 } }}>
              <Grid container spacing={2}>
                {gallery.slice(0, 3).map((src, i) => (
                  <Grid key={i} item xs={12} sm={4}>
                    <Box
                      component="img"
                      src={src}
                      alt={`Laundry photo ${i + 1}`}
                      sx={{
                        width: "100%",
                        height: { xs: 180, md: 220 },
                        objectFit: "cover",
                        borderRadius: 3,
                        boxShadow: 2,
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Container>
      </Box>

      {/* HOW IT WORKS */}
      <Box id="how" sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, textAlign: "center", mb: 4 }}
          >
            How it works
          </Typography>

          <Grid container spacing={3}>
            {[
              { n: "1", t: "Schedule", d: "Book a pickup window that suits you." },
              { n: "2", t: "We collect", d: "Our driver picks up at your door." },
              { n: "3", t: "We clean & press", d: "With your chosen detergent & scent." },
              { n: "4", t: "We deliver", d: "Fresh, folded, and ready to wear." },
            ].map((s, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Card variant="outlined" sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography variant="h3" color="primary" fontWeight={800}>
                      {s.n}
                    </Typography>
                    <Typography variant="h6" fontWeight={700} sx={{ mt: 0.5 }}>
                      {s.t}
                    </Typography>
                    <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                      {s.d}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Stack alignItems="center" sx={{ mt: 6 }}>
            <Button component={RouterLink} to="/order" variant="contained" size="large">
              Schedule your pickup
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* FOOTER */}
      <Box component="footer" sx={{ mt: "auto", py: 4, bgcolor: "background.paper" }}>
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} The Laundry Lady
            </Typography>
            <Typography
              sx={{
                fontFamily: '"Great Vibes", cursive',
                color: "primary.main",
                fontSize: 24,
                lineHeight: 1,
              }}
            >
              The Laundry Lady
            </Typography>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}

function FeatureChip({ icon, text }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Box
        sx={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          bgcolor: "primary.main",
          color: "white",
          display: "grid",
          placeItems: "center",
        }}
      >
        {React.cloneElement(icon, { fontSize: "small" })}
      </Box>
      <Typography variant="body2" color="text.secondary">
        {text}
      </Typography>
    </Stack>
  );
}

function Row({ text }) {
  return (
    <Stack direction="row" spacing={1.5} alignItems="center">
      <Box
        sx={{
          width: 8,
          height: 8,
          bgcolor: "primary.main",
          borderRadius: "50%",
        }}
      />
      <Typography variant="body2" color="text.secondary">
        {text}
      </Typography>
    </Stack>
  );
}


