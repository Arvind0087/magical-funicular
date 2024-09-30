import SvgColor from "../../components/svg-color/SvgColor";

const Icons = (name) => (
  <SvgColor
    src={`/assets/icons/navbar/${name}.svg`}
    sx={{ width: 1, height: 1 }}
  />
);

export const ICONS = {
  blog: Icons("ic_blog"),
  cart: Icons("ic_cart"),
  chat: Icons("ic_chat"),
  mail: Icons("ic_mail"),
  user: Icons("ic_user"),
  file: Icons("ic_file"),
  lock: Icons("ic_lock"),
  label: Icons("ic_label"),
  blank: Icons("ic_blank"),
  kanban: Icons("ic_kanban"),
  folder: Icons("ic_folder"),
  banking: Icons("ic_banking"),
  booking: Icons("ic_booking"),
  invoice: Icons("ic_invoice"),
  calendar: Icons("ic_calendar"),
  disabled: Icons("ic_disabled"),
  external: Icons("ic_external"),
  menuItem: Icons("ic_menu_item"),
  ecommerce: Icons("ic_ecommerce"),
  analytics: Icons("ic_analytics"),
  dashboard: Icons("ic_dashboard"),
  Shorts: Icons("ic_shorts"),
  doubt: Icons("ic_doubt"),
  mentorship: Icons("mentorship"),
  students: Icons("students"),
  assignment: Icons("assignment"),
  question: Icons("question"),
  revision: Icons("revision"),
  notice: Icons("notice"),
  Academics: Icons("Academics"),
  ActivityLog: Icons("ActivityLog"),
  FAQ: Icons("FAQ"),
  Gallery: Icons("Gallery"),
  GeneralSetting: Icons("GeneralSetting"),
  Master: Icons("Master"),
  OnlyforYou: Icons("OnlyforYou"),
  Package: Icons("Package"),
  ScholarshipApplication: Icons("ScholarshipApplication"),
  Scholarship: Icons("Scholarship"),
  Staff: Icons("Staff"),
  Syllabus: Icons("Syllabus"),
  Test: Icons("Test"),
  Enquiry: Icons("Enquiry"),
};
