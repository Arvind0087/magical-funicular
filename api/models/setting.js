const { INTEGER, STRING, TEXT } = require("sequelize");

module.exports = (Sequelize) => {
  const setting = Sequelize.define("setting", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //required:true
      unique: true,
    },
    instruction: {
      type: TEXT,
    },
    firebaseKey: {
      type: STRING,
    },
    razorpayKey: {
      type: STRING,
    },
    razorpayId: {
      type: STRING,
    },
    socialContent: {
      type: STRING,
    },
    siteKeyword: {
      type: STRING,
    },
    favicon: {
      type: STRING,
    },
    siteLogo: {
      type: STRING,
    },
    siteMiniLogo: {
      type: STRING,
    },
    sitePreloader: {
      type: STRING,
    },
    loginImage: {
      type: STRING,
    },
    siteTitle: {
      type: STRING,
    },
    siteAuthorName: {
      type: STRING,
    },
    siteDescription: {
      type: TEXT,
    },
    enrollmentWord: {
      type: STRING,
    },
    copyrightText: {
      type: TEXT,
    },
    applicationName: {
      type: STRING,
    },
    tagline: {
      type: STRING,
    },
    HeaderIcon: {
      type: STRING,
    },
    mobileLogo: {
      type: STRING,
    },
    facebookLink: {
      type: STRING,
    },
    linkedinLink: {
      type: STRING,
    },
    whatsappLink: {
      type: STRING,
    },
    youtubeLink: {
      type: STRING,
    },
    instagramLink: {
      type: STRING,
    },
    helpLineNumber: {
      type: STRING,
    },
    helpEmail: {
      type: STRING,
    },
    onboardingImage1: {
      type: STRING,
    },
    onboardingContent1: {
      type: STRING,
    },
    onboardingImage2: {
      type: STRING,
    },
    onboardingContent2: {
      type: STRING,
    },
    onboardingImage3: {
      type: STRING,
    },
    onboardingContent3: {
      type: STRING,
    },
    subscriptionType: {
      type: STRING,
      validate: {
        isIn: [["Free", "Paid"]], // Allowed values
      },
    },
    amount: {
      type: INTEGER,
    },
    sessionAllocated: {
      type: INTEGER,
    },
    bookmarkVideoImage: {
      type: STRING,
    },
    bookmarkQuestionImage: {
      type: STRING,
    },
    downloadVideoImage: {
      type: STRING,
    },
    androidAppUrl: {
      type: TEXT,
    },
    iosAppUrl: {
      type: TEXT,
    },
    studentAndroidMobileVersion: {
      type: STRING,
    },
    studentIosMobileVersion: {
      type: STRING,
    },
    parentAndroidMobileVersion: {
      type: STRING,
    },
    parentIosMobileVersion: {
      type: STRING,
    },
    parentPrimaryColor: {
      type: STRING,
    },
    parentSecondaryColor: {
      type: STRING,
    },
    parentBgColor: {
      type: STRING,
    },
    studentPrimaryColor: {
      type: STRING,
    },
    studentSecondaryColor: {
      type: STRING,
    },
    studentBgColor: {
      type: STRING,
    },
    type: {
      type: STRING,
      validate: {
        isIn: [
          [
            "instruction",
            "razorpay",
            "siteSetting",
            "mobileApp",
            "firebase",
            "admin",
            "mentor",
            "bookmarkImages",
          ],
        ], // Allowed values
      },
    },
  });

  return setting;
};
