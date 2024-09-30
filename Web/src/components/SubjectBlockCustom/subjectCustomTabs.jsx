import React from "react";
import { Tab, Tabs} from "@mui/material";
import _ from "lodash";

const SubjectCustomTabs = ({subjectInfo, currentTab, handleEvent}) => {
        return <Tabs
            value={currentTab}
            onChange={(event, newValue) => handleEvent(newValue)}
        >
            {subjectInfo.map((tab, In) => (
                <Tab
                    key={In}
                    label={tab.name}
                    value={tab.id}
                    icon={<img src={tab.image} width={"36px"} />}
                    iconPosition="start"
                    sx={{
                        bgcolor: Boolean(currentTab === tab.id) && "primary.lighter",
                        px: 5,
                        margin: "0 !important",
                    }}
                />
            ))}
        </Tabs>
       
}

export default SubjectCustomTabs;