import React, { useState } from 'react';
import  Container from "@mui/material/Container";
import { useSettingsContext } from '../../../components/settings';
import CreateTests from './components/createsTest';

const SelectSubjects = [
    {
        Chapter: "science",
        id: 1,
        selected: false,
        value: "science"
    },
    {
        Chapter: "Hindi",
        id: 2,
        selected: false,
        value: "Hindi"
    },
    {
        Chapter: "Maths",
        id: 3,
        selected: false,
        value: "Maths",
    },
    {
        Chapter: "Sanskrit",
        id: 4,
        selected: false,
        value: "Sanskrit",
    },
    {
        Chapter: "Social-science",
        id: 5,
        selected: false,
        value: 'Social-science'
    },
    {
        Chapter: "English",
        id: 6,
        selected: false,
        Chapter: "English"
    },
];

const levels = [
    {
        level: 'Easy',
        id: 1,
    },
    {
        level: 'Medium',
        id: 2,
    },
    {
        level: 'Hard',
        id: 3,
    },
];

const QuentionsNo = [
    {
        number: 5,
        id: 1,
    },
    {
        number: 10,
        id: 2,
    },
    {
        number: 15,
        id: 3,
    },
];

const Time =
    [
        { name: "Quick 5 mins", id: "00:05:00" },
        { name: "10 mins", id: "00:10:00" },
        { name: "20 mins", id: "00:20:00" },
        { name: "30 mins", id: "00:30:00" },
    ]

const CreateTestPage = () => {
    const { themeStretch } = useSettingsContext();

    // states...
    const [activeState, setActiveState] = useState({
        index: 0,
        heading: 'Create Test'
    })
    const [openChapter, setOpenChapter] = useState(false);

    return (
        <>
            <Container maxWidth={themeStretch ? false : "xl"}>
                <CreateTests SelectSubjects={SelectSubjects} levels={levels} QuentionsNo={QuentionsNo} Time={Time}
                    activeState={activeState}
                    setActiveState={setActiveState}
                    setOpenChapter={setOpenChapter}
                    openChapter={openChapter}
                />
            </Container>
        </>
    )
}

export default CreateTestPage;
