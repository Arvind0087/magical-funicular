import {
  Button,
  Container,
  ToggleButton,
  ToggleButtonGroup,
  Box,
  Grid,
  FormControl,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import { PATH_DASHBOARD } from "routes/paths";
import { useSettingsContext } from "components/settings";
import CustomBreadcrumbs from "components/custom-breadcrumbs/CustomBreadcrumbs";
import { Link as RouterLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import ScheduleCalender from "./ScheduleCalender";
import ScheduleTable from "./ScheduleTable";
import { getAllStaffFilterAsync } from "redux/filter/filter.async";
import _ from "lodash";
import AutoCompleteCustom from "components/AutoCompleteCustom/AutoCompleteCustom";
import { getScheduleByTeacherIdAsync } from "redux/schedule/schedule.async";

import { getScheduleByIdAsync } from "redux/schedule/schedule.async";

export default function Schedule() {
  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);

  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const [tab, setTab] = useState(1);
  const [searchStaff, setSearchStaff] = useState([]);
  const [searchValue, setSearchValue] = useState(false);
  const [resetValue, setResetValue] = useState(false);
  const { userinfo } = useSelector((state) => state.userinfo);
  const { scheduleLoader, schedulesByIdteacher, schedulesById } = useSelector(
    (state) => state.schedule
  );
  const { modulePermit } = useSelector((state) => state.menuPermission);
  const { filterLoader, allStaff } = useSelector((state) => state.filterInfo);
  const tabTitle = useSelector(
    (state) => state?.admin?.adminSetting?.siteTitle
  );
  const handleChangeRole = (event, newtab) => {
    if (newtab !== null) {
      setTab(newtab);
    }
  };

  useEffect(() => {
    dispatch(getAllStaffFilterAsync({}));
  }, []);

  const handleSearch = () => {
    setSearchValue((current) => !current);
    setResetValue(false);

    dispatch(
      getScheduleByTeacherIdAsync({
        page: paginationpage,
        limit: perPageNumber,
        teacherId: searchStaff.value,
      })
    );
  };

  const handleReset = () => {
    setResetValue((current) => !current);
    setSearchValue(false);
    setSearchStaff([]);
    dispatch(
      getScheduleByTeacherIdAsync({
        page: paginationpage,
        limit: perPageNumber,
        // teacherId: searchStaff.value,
      })
    );
  };

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Schedules | {`${tabTitle}`}</title>
      </Helmet>
      <CustomBreadcrumbs
        // heading="Schedules"
        links={[
          { name: "Schedules", href: "" },
          // { name: "Schedules", href: ""},
        ]}
        action={
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              mt: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {userinfo?.userType === "superAdmin" ||
              userinfo?.userType === "admin" ? (
                <Box>
                  <FormControl>
                    <AutoCompleteCustom
                      size="small"
                      sx={{ width: 220, mr: 2, mb: { xs: 1, md: 0 } }}
                      loading={filterLoader}
                      options={_?.map(allStaff, (ev) => {
                        return {
                          label: `${ev.name} (${_?.capitalize?.(
                            ev.department
                          )})`,
                          value: ev?.id,
                        };
                      })}
                      value={searchStaff}
                      onChange={(event, value) => setSearchStaff(value)}
                      label="Search Staff"
                    />
                  </FormControl>
                  <Button
                    variant="contained"
                    sx={{ borderRadius: "7px", mr: 1, mb: { xs: 1, md: 0 } }}
                    onClick={handleSearch}
                  >
                    Filter
                  </Button>
                  <Button
                    variant="contained"
                    sx={{ borderRadius: "7px", mr: 1, mb: { xs: 1, md: 0 } }}
                    onClick={handleReset}
                  >
                    <AutorenewRoundedIcon />
                  </Button>
                </Box>
              ) : null}
              <Button
                sx={{ borderRadius: "7px", mr: 1, mb: { xs: 1, md: 0 } }}
                to={PATH_DASHBOARD.createschedule}
                component={RouterLink}
                variant="contained"
                disabled={!Boolean(modulePermit?.add)}
              >
                <AddIcon />
              </Button>
            </Box>

            <ToggleButtonGroup
              exclusive
              value={tab}
              onChange={handleChangeRole}
              color="primary"
              sx={{
                p: "1px",
                mr: "20px",
              }}
            >
              <ToggleButton
                value={1}
                sx={{
                  height: "28px",
                }}
              >
                Meeting
              </ToggleButton>
              <ToggleButton
                value={2}
                sx={{
                  height: "28px",
                }}
              >
                Schedules
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        }
      />

      {tab === 1 ? (
        <ScheduleCalender
          {...{
            searchStaff,
            resetValue,
            searchValue,
            setSearchStaff,
          }}
        />
      ) : (
        <ScheduleTable />
      )}
    </Container>
  );
}
