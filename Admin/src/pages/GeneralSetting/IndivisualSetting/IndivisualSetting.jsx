import { Helmet } from "react-helmet-async";
import React, { useEffect, useState } from "react";
import { Box, Container } from "@mui/system";
import { Typography, FormControlLabel, Switch, Grid } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import ModeOptions from "components/settings/drawer/ModeOptions";
import LayoutOptions from "components/settings/drawer/LayoutOptions";
import StretchOptions from "components/settings/drawer/StretchOptions";
import ContrastOptions from "components/settings/drawer/ContrastOptions";
import ColorPresetsOptions from "components/settings/drawer/ColorPresetsOptions";
import { useDispatch, useSelector } from "react-redux";
import {
  createIndividualSettingAsync,
  updateIndividualSettingAsync,
} from "redux/slices/individualSetting/individualSetting.async";
import { useSettingsContext } from "components/settings";
import CustomBreadcrumbs from "components/custom-breadcrumbs";

function IndivisualSetting() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const [valueset, setValueset] = useState();
  const {
    individualSettingLoader,
    getIndividualSetting,
    createIndividualSetting,
    updateIndividualSetting,
  } = useSelector((state) => state.individualSetting);
  const { myData } = useSelector((state) => state.myDataSlice);
  const { userinfo } = useSelector((state) => state.userinfo);
  const tabTitle = useSelector((state) => state?.admin?.adminSetting?.siteTitle);

  const [getHeight, setgetHeight] = useState(
    getIndividualSetting?.dense === "200%" ? true : false
  );
  const handleChangeSwitch = () => {
    setgetHeight((current) => !current);
  };
  const [fixedheight, setfixedheight] = useState();
  useEffect(() => {
    if (getHeight === true) {
      setfixedheight("200%");
    } else {
      setfixedheight("");
    }
  }, [getHeight]);

  const handleClick = () => {
    const payload = {
      userId: userinfo.id,
      themeColorPresents: myData?.themeColorPresets,
      themeContrast: myData?.themeContrast,
      themeDirection: myData?.themeDirection,
      themeLayout: myData?.themeLayout,
      themeMode: myData?.themeMode,
      themeStretch: myData?.themeStretch,
      dense: fixedheight,
    };
    if (getIndividualSetting) {
      dispatch(updateIndividualSettingAsync(payload));
      setValueset("edit");
    } else {
      dispatch(createIndividualSettingAsync(payload));
      setValueset("add");
    }
  };
  useEffect(() => {
    if (valueset === "edit" && updateIndividualSetting.status === 200) {
      toast.success(updateIndividualSetting.message, toastoptions);
      setValueset("");
    } else if (valueset === "add" && createIndividualSetting.status === 200) {
      toast.success(createIndividualSetting.message, toastoptions);
      setValueset("");
    }
  }, [createIndividualSetting, valueset]);

  return (
    <Container maxWidth={themeStretch ? "lg" : false} >
      <Helmet>
        <title>Individual Setting | {`${tabTitle}`}</title>
      </Helmet>

      <CustomBreadcrumbs
        // heading="Instructions"
        links={[
          { name: "General Settings", href: "" },
          { name: "Individual Setting ", href: "" },
        ]}
      />

      <Typography
        variant="h4"
        sx={{
          flexGrow: 1,
          color: "text.secondary",
          fontWeight: '800px',
          mb: 5
        }}
      >
        Individual Setting
      </Typography>

      <Grid
        container
        spacing={5}
        sx={{ dispaly: "flex", flexDirection: "row", justifyContent: "center" }}
      >
        <Grid item xs={6} md={3}>
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                color: "text.secondary",
                mt: "10px",
                mb: "10px",
                fontSize: "15px",
              }}
            >
              Mode
            </Typography>
            <ModeOptions />
          </Box>
        </Grid>

        <Grid item xs={6} md={3}>
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                color: "text.secondary",
                mt: "10px",
                mb: "10px",
                fontSize: "15px",
              }}
            >
              Contrast
            </Typography>

            <ContrastOptions />
          </Box>
        </Grid>

        <Grid item xs={6} md={3}>
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                color: "text.secondary",
                mt: "10px",
                mb: "10px",
                fontSize: "15px",
              }}
            >
              Layout
            </Typography>
            <LayoutOptions />
          </Box>
        </Grid>
      </Grid>

      <Grid
        container
        spacing={5}
        sx={{
          dispaly: "flex",
          flexDirection: "row",
          justifyContent: "center",
          mt: "7px",
        }}
      >
        <Grid item xs={6} md={3}>
          <Box>
            <Typography
              title="Only available at large resolutions > 1600px (xl)"
              variant="subtitle2"
              sx={{
                color: "text.secondary",
                mt: "10px",
                mb: "10px",
                fontSize: "15px",
              }}
            >
              Presets
            </Typography>
            <ColorPresetsOptions />
          </Box>
        </Grid>

        <Grid item xs={6} md={3}>
          <Box>
            <Typography
              title="Only available at large resolutions > 1600px (xl)"
              variant="subtitle2"
              sx={{
                color: "text.secondary",
                mt: "10px",
                mb: "10px",
                fontSize: "15px",
              }}
            >
              Stretch
            </Typography>
            <StretchOptions />
          </Box>
        </Grid>

        <Grid item xs={6} md={3}>
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                color: "text.secondary",
                mt: "10px",
                mb: "10px",
                fontSize: "15px",
              }}
            >
              Dense
            </Typography>

            <FormControlLabel
              label="Dense Rows"
              value="start"
              labelPlacement="start"
              style={{ fontSize: "30px" }}
              sx={{
                color: "text.secondary",
                fontSize: "15px!important",
              }}
              control={
                <Switch
                  checked={getHeight}
                  onChange={handleChangeSwitch}
                  name="antoine"
                />
              }
            />
          </Box>
        </Grid>
      </Grid>

      <Grid
        container
        spacing={5}
        sx={{
          dispaly: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
          mt: "7px",
        }}
      >
        <Grid item xs={6} md={3}>
          <Box>
            <LoadingButton
              type="submit"
              variant="contained"
              onClick={handleClick}
              loading={individualSettingLoader}
            >
              Submit
            </LoadingButton>
          </Box>
        </Grid>
      </Grid>

      {/* Will On As Per Clint Requirment */}
      {/* <Box>
                <Typography
                    variant="subtitle2"
                    sx={{
                        color: "text.secondary",
                        mt: "10px",
                        mb: "10px",
                        fontSize: '15px'
                    }}
                >
                    Direction
                </Typography>
                <DirectionOptions />
            </Box> */}
    </Container>
  );
}

export default IndivisualSetting;
