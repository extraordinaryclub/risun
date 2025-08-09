/* eslint-disable react/prop-types */
import PropTypes from "prop-types";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";

import {
  ChevronLeft,
  ChevronRightOutlined,
  PictureAsPdf,
  LocationOn,
  SolarPower,
  ReportProblem,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";


const navItems = [
  {
    text: "User Manual",
    icon: <PictureAsPdf />,
    path: "dashboard",
  },
  {
    text: "Site Suitability Recommendations",
    icon: null,
  },
  {
    text: "Monitoring",
    icon: <LocationOn />,
    path: "monitoring",
  },
  {
    text: "Solar Power Forecast",
    icon: null,
  },
  {
    text: "Power Generation Prediction",
    icon: <SolarPower />,
    path: "powerprediction",
  },
  {
    text: "Fault detection",
    icon: null,
  },
  {
    text: "Fault",
    icon: <ReportProblem />,
    path: "fault",
  },
];

function Sidebar({
  user,
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
  isNonMobile,
}) {
  const { pathname } = useLocation();
  const [active, setActive] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    setActive(pathname.substring(1));
  }, [pathname]);

  return (
    <Box component="nav">
      {isSidebarOpen && (
        <Drawer
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant="persistent"
          anchor="left"
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": {
              color: theme.palette.secondary[200],
              backgroundColor: theme.palette.background.alt,
              boxSizing: "border-box",
              borderWidth: isNonMobile ? 0 : "2px",
              width: drawerWidth,
            },
          }}
        >
          <Box width="100%" sx={{ overflowY: "scroll" }}>
            <Box m="1.5rem 2rem 1.5rem 3rem">
              <FlexBetween color={theme.palette.secondary.main}>
                <Box
                  display="flex"
                  alignItems="center"
                  gap="0.5rem"
                  width="fit-content"
                >
                  <Typography variant="h4" fontWeight="bold">
                    RISUN Dashboard
                  </Typography>
                  {!isNonMobile && (
                    <IconButton
                      onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                      <ChevronLeft />
                    </IconButton>
                  )}
                </Box>
              </FlexBetween>
            </Box>
            <List>
              {navItems.map(({ text, icon, path }) => {
                if (!icon) {
                  return (
                    <Typography
                      key={text}
                      sx={{ m: "2.25rem 0 1rem 2rem" }}
                      color={theme.palette.secondary[300]}
                    >
                      {text}
                    </Typography>
                  );
                }
                const lcText = path ? path.toLowerCase() : text.toLowerCase();

                return (
                  <ListItem key={text} disablePadding>
                    <ListItemButton
                      onClick={() => {
                        if (path) {
                          navigate(`/${lcText}`);
                          setActive(lcText);
                        }
                      }}
                      sx={{
                        backgroundColor:
                          active === lcText
                            ? theme.palette.secondary[200]
                            : "transparent",
                        color:
                          active === lcText
                            ? theme.palette.secondary[900]
                            : theme.palette.secondary[100],
                        "&:hover": {
                          backgroundColor:
                            active === lcText
                              ? theme.palette.secondary[200]
                              : "",
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          ml: "2rem",
                          color:
                            active === lcText
                              ? theme.palette.primary[600]
                              : theme.palette.secondary[200],
                        }}
                      >
                        {icon}
                      </ListItemIcon>
                      <ListItemText primary={text} />
                      {active === lcText && (
                        <ChevronRightOutlined sx={{ ml: "auto" }} />
                      )}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>

          <Box>
            <Divider />
            <FlexBetween
              textTransform="none"
              gap="1rem"
              m="1.5rem 2rem 1.5rem 3rem"
            >
            
              <Box textAlign="left">
                <Typography
                  fontWeight="bold"
                  fontSize="0.9rem"
                  sx={{ color: theme.palette.secondary[100] }}
                >
                  {user.name}
                </Typography>
                <Typography
                  fontSize="0.8rem"
                  sx={{ color: theme.palette.secondary[200] }}
                >
                  {user.occupation}
                </Typography>
              </Box>
              {/* <SettingsOutlined
                sx={{
                  color: theme.palette.secondary[300],
                  fontSize: "25px ",
                }}
              /> */}
            </FlexBetween>
          </Box>
        </Drawer>
      )}
    </Box>
  );
}

Sidebar.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    occupation: PropTypes.string.isRequired,
  }).isRequired,
  drawerWidth: PropTypes.number.isRequired,
  isSidebarOpen: PropTypes.bool.isRequired,
  setIsSidebarOpen: PropTypes.func.isRequired,
  isNonMobile: PropTypes.bool.isRequired,
};

export default Sidebar;

