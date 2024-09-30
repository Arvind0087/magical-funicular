import { useEffect } from "react";
import { PATH_DASHBOARD } from "../../routes/paths";
import { ICONS } from "./utils";

export default function DashBoardFunction() {
  const DashMenus = [
    {
      items: [
        { title: "Dashboard", path: PATH_DASHBOARD.app, icon: ICONS.dashboard },
        {
          title: "Syllabus",
          path: PATH_DASHBOARD.syllabus,
          icon: ICONS.calendar,
        },
        {
          title: "Courses",
          path: PATH_DASHBOARD.courses,
          icon: ICONS.calendar,
        },
        // { title: "Revision", path: PATH_DASHBOARD.revision, icon: ICONS.revision },
        { title: "Doubts", path: PATH_DASHBOARD.doubts, icon: ICONS.doubt },
        // {
        //   title: "Master",
        //   path: PATH_DASHBOARD.master.master,
        //   icon: ICONS.dashboard,
        //   children: [
        //     { title: "Courses", path: PATH_DASHBOARD.master.courses },
        //     { title: "Board", path: PATH_DASHBOARD.master.board },
        //     { title: "Class", path: PATH_DASHBOARD.master.class },
        //     { title: "Batch Type", path: PATH_DASHBOARD.master.batch },
        //     { title: "Batch Date", path: PATH_DASHBOARD.master.batchDate },
        //     { title: "Subject", path: PATH_DASHBOARD.master.subject },
        //     { title: "Chapter", path: PATH_DASHBOARD.master.chapter },
        //     { title: "banner", path: PATH_DASHBOARD.master.banner },
        //   ],
        // },
        // {
        //   title: "Students",
        //   path: PATH_DASHBOARD.student.student,
        //   icon: ICONS.ecommerce,
        // },
        // {
        //   title: "Staffs",
        //   path: PATH_DASHBOARD.teacher.teacher,
        //   icon: ICONS.analytics,
        // },
        { title: "Shorts", path: PATH_DASHBOARD.shorts, icon: ICONS.ecommerce },
        {
          title: "Quiz",
          path: PATH_DASHBOARD.quiz,
          icon: ICONS.calendar,
        },
        {
          title: "My Bookmarks",
          path: PATH_DASHBOARD.myBookmarks,
          icon: ICONS.ecommerce,
        },
        // {
        //   title: "Mentorship", path: PATH_DASHBOARD.mentorship, icon: ICONS.mentorship
        // },
        {
          title: "Assignment",
          path: PATH_DASHBOARD.assignment,
          icon: ICONS.assignments,
        },
        {
          title: "Order",
          path: PATH_DASHBOARD.orderDetail,
          icon: ICONS.orders,
        },
        // {
        //   title: "Scholarship Test", path: PATH_DASHBOARD.scholarshipTest, icon: ICONS.menuItem
        // },
        {
          title: "Live",
          path: PATH_DASHBOARD.event,
          icon: ICONS.ecommerce,
        },
      ],
    },
  ];
  return DashMenus;
}
