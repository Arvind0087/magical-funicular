const db = require("../../models/index");
const msg = require("../../constants/Messages");
const uploadFileS3 = require("../../helpers/uploadFileS3");
const { getSignedUrlCloudFront } = require("../../helpers/cloudFront");
const Setting = db.setting;

//ANCHOR : create Setting
const createInstruction = async (req, res) => {
  try {
    const {
      instruction,
      firebaseKey,
      razorpayKey,
      razorpayId,
      socialContent,
      siteKeyword,
      favicon,
      siteLogo,
      siteMiniLogo,
      sitePreloader,
      loginImage,
      siteTitle,
      siteAuthorName,
      siteDescription,
      enrollmentWord,
      copyrightText,
      applicationName,
      tagline,
      HeaderIcon,
      mobileLogo,
      facebookLink,
      linkedinLink,
      instagramLink,
      whatsappLink,
      youtubeLink,
      helpLineNumber,
      helpEmail,
      onboardingImage1,
      onboardingContent1,
      onboardingImage2,
      onboardingContent2,
      onboardingImage3,
      onboardingContent3,
      subscriptionType,
      amount,
      sessionAllowed,
      bookmarkVideoImage,
      bookmarkQuestionImage,
      downloadVideoImage,
      androidAppUrl,
      iosAppUrl,
      studentAndroidMobileVersion,
      studentIosMobileVersion,
      parentAndroidMobileVersion,
      parentIosMobileVersion,
      parentPrimaryColor,
      parentSecondaryColor,
      parentBgColor,
      studentPrimaryColor,
      studentSecondaryColor,
      studentBgColor,
      type,
    } = req.body;

    let payload = {
      subscriptionType: subscriptionType,
      amount: amount,
      sessionAllowed: sessionAllowed,
      firebaseKey: firebaseKey,
      socialContent: socialContent,
      siteKeyword: siteKeyword,
      siteTitle: siteTitle,
      siteAuthorName: siteAuthorName,
      siteDescription: siteDescription,
      enrollmentWord: enrollmentWord,
      copyrightText: copyrightText,
      instruction: instruction,
      razorpayKey: razorpayKey,
      razorpayId: razorpayId,
      applicationName: applicationName,
      tagline: tagline,
      facebookLink: facebookLink,
      linkedinLink: linkedinLink,
      instagramLink: instagramLink,
      whatsappLink: whatsappLink,
      youtubeLink: youtubeLink,
      helpLineNumber: helpLineNumber,
      helpEmail: helpEmail,
      onboardingContent1: onboardingContent1,
      onboardingContent2: onboardingContent2,
      onboardingContent3: onboardingContent3,
      androidAppUrl: androidAppUrl,
      iosAppUrl: iosAppUrl,
      studentAndroidMobileVersion: studentAndroidMobileVersion,
      studentIosMobileVersion: studentIosMobileVersion,
      parentAndroidMobileVersion: parentAndroidMobileVersion,
      parentIosMobileVersion: parentIosMobileVersion,
      parentPrimaryColor: parentPrimaryColor,
      parentSecondaryColor: parentSecondaryColor,
      parentBgColor: parentBgColor,
      studentPrimaryColor: studentPrimaryColor,
      studentSecondaryColor: studentSecondaryColor,
      studentBgColor: studentBgColor,
      type: type,
    };

    const getInstructionSetting = await Setting.findOne({
      where: { type: type },
    });

    //NOTE: favicon upload
    if (favicon && favicon.includes("base64")) {
      const uploadImage = await uploadFileS3(
        favicon,
        msg.SITE_SETTING_FOLDER_CREATED
      );
      payload = { ...payload, favicon: uploadImage.Key };
    }

    //NOTE: siteLogo upload
    if (siteLogo && siteLogo.includes("base64")) {
      const uploadImage = await uploadFileS3(
        siteLogo,
        msg.SITE_SETTING_FOLDER_CREATED
      );
      payload = { ...payload, siteLogo: uploadImage.Key };
    }

    //NOTE: siteMiniLogo upload
    if (siteMiniLogo && siteMiniLogo.includes("base64")) {
      const uploadImage = await uploadFileS3(
        siteMiniLogo,
        msg.SITE_SETTING_FOLDER_CREATED
      );
      payload = { ...payload, siteMiniLogo: uploadImage.Key };
    }

    //NOTE: sitePreloader upload
    if (sitePreloader && sitePreloader.includes("base64")) {
      const uploadImage = await uploadFileS3(
        sitePreloader,
        msg.SITE_SETTING_FOLDER_CREATED
      );
      payload = { ...payload, sitePreloader: uploadImage.Key };
    }

    //NOTE: loginImage upload
    if (loginImage && loginImage.includes("base64")) {
      const uploadImage = await uploadFileS3(
        loginImage,
        msg.SITE_SETTING_FOLDER_CREATED
      );
      payload = { ...payload, loginImage: uploadImage.Key };
    }

    //NOTE: HeaderIcon upload
    if (HeaderIcon && HeaderIcon.includes("base64")) {
      const uploadImage = await uploadFileS3(
        HeaderIcon,
        msg.SITE_SETTING_FOLDER_CREATED
      );
      payload = { ...payload, HeaderIcon: uploadImage.Key };
    }
    //NOTE: mobileLogo upload
    if (mobileLogo && mobileLogo.includes("base64")) {
      const uploadImage = await uploadFileS3(
        mobileLogo,
        msg.SITE_SETTING_FOLDER_CREATED
      );
      payload = { ...payload, mobileLogo: uploadImage.Key };
    }

    //NOTE: onboardingImage 1 upload
    if (onboardingImage1 && onboardingImage1.includes("base64")) {
      const uploadImage = await uploadFileS3(
        onboardingImage1,
        msg.SITE_SETTING_FOLDER_CREATED
      );
      payload = { ...payload, onboardingImage1: uploadImage.Key };
    }
    //NOTE: onboardingImage 2 upload
    if (onboardingImage2 && onboardingImage2.includes("base64")) {
      const uploadImage = await uploadFileS3(
        onboardingImage2,
        msg.SITE_SETTING_FOLDER_CREATED
      );
      payload = { ...payload, onboardingImage2: uploadImage.Key };
    }

    //NOTE: onboardingImage 3 upload
    if (onboardingImage3 && onboardingImage3.includes("base64")) {
      const uploadImage = await uploadFileS3(
        onboardingImage3,
        msg.SITE_SETTING_FOLDER_CREATED
      );
      payload = { ...payload, onboardingImage3: uploadImage.Key };
    }

    //NOTE - bookmark video images
    if (bookmarkVideoImage && bookmarkVideoImage.includes("base64")) {
      const uploadImage = await uploadFileS3(
        bookmarkVideoImage,
        msg.BOOKMARK_IMAGES_FOLDER
      );
      payload = { ...payload, bookmarkVideoImage: uploadImage.Key };
    }

    //NOTE - bookmark question images
    if (bookmarkQuestionImage && bookmarkQuestionImage.includes("base64")) {
      const uploadImage = await uploadFileS3(
        bookmarkQuestionImage,
        msg.BOOKMARK_IMAGES_FOLDER
      );
      payload = { ...payload, bookmarkQuestionImage: uploadImage.Key };
    }

    //NOTE - download question images
    if (downloadVideoImage && downloadVideoImage.includes("base64")) {
      const uploadImage = await uploadFileS3(
        downloadVideoImage,
        msg.BOOKMARK_IMAGES_FOLDER
      );
      payload = { ...payload, downloadVideoImage: uploadImage.Key };
    }

    if (getInstructionSetting) {
      await Setting.update(payload, {
        where: { type: type },
      });

      return res.status(200).send({
        status: 200,
        message: msg.GENERAL_SETTING_UPDATED,
      });
    }

    const Settings = new Setting(payload);

    await Settings.save();

    return res.status(200).send({
      status: 200,
      message: msg.GENERAL_SETTING_CREATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR: get all SETTING
const getAllInstruction = async (req, res) => {
  try {
    const { search } = req.query;
    let getInstructionSetting;
    if (search === "instruction") {
      getInstructionSetting = await Setting.findOne({
        attributes: {
          exclude: ["createdAt", "updatedAt", "razorpayKey", "razorpayId"],
        },
      });
      if (!getInstructionSetting) {
        return res.status(400).send({
          status: 400,
          message: msg.GENERAL_SETTING_NOT_FOUND,
        });
      }
    } else if (search === "razorpay") {
      getInstructionSetting = await Setting.findOne({
        attributes: {
          exclude: ["createdAt", "updatedAt", "instruction"],
        },
      });
      if (!getInstructionSetting) {
        return res.status(400).send({
          status: 400,
          message: msg.GENERAL_SETTING_NOT_FOUND,
        });
      }
    } else {
      getInstructionSetting = await Setting.findOne({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      if (!getInstructionSetting) {
        return res.status(400).send({
          status: 400,
          message: msg.GENERAL_SETTING_NOT_FOUND,
        });
      }
    }

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: getInstructionSetting,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get SETING by id
const getInstructionById = async (req, res) => {
  try {
    const getInstructionSetting = await Setting.findOne({
      where: { id: req.params.id },
    });

    if (!getInstructionSetting) {
      return res.status(400).send({
        status: 400,
        message: msg.GENERAL_SETTING_NOT_FOUND,
        data: [],
      });
    }

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: getInstructionSetting,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR: update INSTRUCTION
const updateInstructionById = async (req, res) => {
  try {
    const { instruction, razorpayKey, razorpayId, Id } = req.body;
    const getInstructionSetting = await Setting.findOne({
      where: { id: Id },
    });
    if (!getInstructionSetting) {
      return res
        .status(400)
        .send({ status: 400, message: msg.GENERAL_SETTING_NOT_FOUND });
    }

    await Setting.update(
      {
        instruction: instruction,
        razorpayKey: razorpayKey,
        razorpayId: razorpayId,
      },
      { where: { id: Id } }
    );

    return res.status(200).send({
      status: 200,
      message: msg.GENERAL_SETTING_UPDATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : delete INSTRUCTION
const deleteInstruction = async (req, res) => {
  try {
    const newSetting = await Setting.findOne({
      where: { id: req.params.id },
    });
    if (!newSetting) {
      return res.status(200).send({
        status: 200,
        message: msg.GENERAL_SETTING_NOT_FOUND,
        data: [],
      });
    }
    await newSetting.destroy();
    return res
      .status(200)
      .send({ status: 200, message: msg.GENERAL_SETTING_DELETED });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR: get all SETTING by type
const getSettingByType = async (req, res) => {
  try {
    const { type } = req.query;

    const getInstructionSetting = await Setting.findOne({
      where: {
        type: type === "view" ? "mobileApp" : type,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    if (!getInstructionSetting) {
      return res.status(200).send({
        status: 200,
        message: msg.GENERAL_SETTING_NOT_FOUND,
      });
    }

    if (type === "siteSetting" || type === "admin") {
      getInstructionSetting.favicon = await getSignedUrlCloudFront(
        getInstructionSetting?.favicon
      );
      getInstructionSetting.siteLogo = await getSignedUrlCloudFront(
        getInstructionSetting.siteLogo
      );
      getInstructionSetting.siteMiniLogo = await getSignedUrlCloudFront(
        getInstructionSetting.siteMiniLogo
      );
      getInstructionSetting.sitePreloader = await getSignedUrlCloudFront(
        getInstructionSetting.sitePreloader
      );
      getInstructionSetting.loginImage = await getSignedUrlCloudFront(
        getInstructionSetting?.loginImage
      );
    }

    let result = {};
    if (type === "view") {
      const bookmarkImages = await Setting.findOne({
        where: {
          type: "bookmarkImages",
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });

      //NOTE - site setting
      const siteSetting = await Setting.findOne({
        where: {
          type: "siteSetting",
        },
        attributes: ["copyrightText"],
      });

      let final = [];
      getInstructionSetting.HeaderIcon = await getSignedUrlCloudFront(
        getInstructionSetting?.HeaderIcon
      );
      getInstructionSetting.mobileLogo = await getSignedUrlCloudFront(
        getInstructionSetting?.mobileLogo
      );
      getInstructionSetting.onboardingImage1 = await getSignedUrlCloudFront(
        getInstructionSetting.onboardingImage1
      );
      getInstructionSetting.onboardingImage2 = await getSignedUrlCloudFront(
        getInstructionSetting.onboardingImage2
      );
      getInstructionSetting.onboardingImage3 = await getSignedUrlCloudFront(
        getInstructionSetting.onboardingImage3
      );

      getInstructionSetting.bookmarkVideoImage = await getSignedUrlCloudFront(
        bookmarkImages?.bookmarkVideoImage
      );
      getInstructionSetting.bookmarkQuestionImage =
        await getSignedUrlCloudFront(bookmarkImages?.bookmarkQuestionImage);
      getInstructionSetting.downloadVideoImage = await getSignedUrlCloudFront(
        bookmarkImages.downloadVideoImage
      );

      result = {
        socialContent: getInstructionSetting.socialContent,
        copyrightText: siteSetting.copyrightText, //TODO - copyright from site setting
        applicationName: getInstructionSetting.applicationName,
        tagline: getInstructionSetting.tagline,
        HeaderIcon: getInstructionSetting.HeaderIcon,
        mobileLogo: getInstructionSetting.mobileLogo,
        HeaderIcon: getInstructionSetting.HeaderIcon,
        facebookLink: getInstructionSetting.facebookLink,
        linkedinLink: getInstructionSetting.linkedinLink,
        whatsappLink: getInstructionSetting.whatsappLink,
        youtubeLink: getInstructionSetting.youtubeLink,
        instagramLink: getInstructionSetting.instagramLink,
        helpLineNumber: getInstructionSetting.helpLineNumber,
        helpEmail: getInstructionSetting.helpEmail,
        type: getInstructionSetting.type,
        bookmarkVideoImage: getInstructionSetting.bookmarkVideoImage,
        bookmarkQuestionImage: getInstructionSetting.bookmarkQuestionImage,
        downloadVideoImage: getInstructionSetting.downloadVideoImage,
        androidAppUrl: getInstructionSetting.androidAppUrl,
        iosAppUrl: getInstructionSetting.iosAppUrl,
        androidMobileVersion: getInstructionSetting.studentAndroidMobileVersion,
        iosMobileVersion: getInstructionSetting.studentIosMobileVersion,
        parentAndroidMobileVersion:
          getInstructionSetting.parentAndroidMobileVersion,
        parentIosMobileVersion: getInstructionSetting.parentIosMobileVersion,
        parentPrimaryColor: getInstructionSetting.parentPrimaryColor,
        parentSecondaryColor: getInstructionSetting.parentSecondaryColor,
        parentBgColor: getInstructionSetting.parentBgColor,
        studentPrimaryColor: getInstructionSetting.studentPrimaryColor,
        studentSecondaryColor: getInstructionSetting.studentSecondaryColor,
        studentBgColor: getInstructionSetting.studentBgColor,
        onboarding: [
          {
            key: "0",
            text: getInstructionSetting.onboardingContent1,
            image: getInstructionSetting.onboardingImage1,
          },
          {
            key: "1",
            text: getInstructionSetting.onboardingContent2,
            image: getInstructionSetting.onboardingImage2,
          },
          {
            key: "2",
            text: getInstructionSetting.onboardingContent3,
            image: getInstructionSetting.onboardingImage3,
          },
        ],
      };
    }

    if (type === "mobileApp") {
      //NOTE - get web site setting details
      const siteSetting = await Setting.findOne({
        where: {
          type: "siteSetting",
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });

      getInstructionSetting.copyrightText = siteSetting.copyrightText;

      getInstructionSetting.HeaderIcon = await getSignedUrlCloudFront(
        getInstructionSetting?.HeaderIcon
      );
      getInstructionSetting.mobileLogo = await getSignedUrlCloudFront(
        getInstructionSetting?.mobileLogo
      );
      getInstructionSetting.onboardingImage1 = await getSignedUrlCloudFront(
        getInstructionSetting.onboardingImage1
      );
      getInstructionSetting.onboardingImage2 = await getSignedUrlCloudFront(
        getInstructionSetting.onboardingImage2
      );
      getInstructionSetting.onboardingImage3 = await getSignedUrlCloudFront(
        getInstructionSetting.onboardingImage3
      );
    }

    if (type === "bookmarkImages") {
      getInstructionSetting.bookmarkVideoImage = await getSignedUrlCloudFront(
        getInstructionSetting?.bookmarkVideoImage
      );
      getInstructionSetting.bookmarkQuestionImage =
        await getSignedUrlCloudFront(
          getInstructionSetting?.bookmarkQuestionImage
        );
      getInstructionSetting.downloadVideoImage = await getSignedUrlCloudFront(
        getInstructionSetting.downloadVideoImage
      );
    }

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: type === "view" ? result : getInstructionSetting,
    });
  } catch (err) {
    return res
      .status(200)
      .send({ status: 200, message: msg.GENERAL_SETTING_NOT_FOUND });
  }
};

//ANCHOR: update INSTRUCTION  by type
const updateSettingByType = async (req, res) => {
  try {
    const {
      instruction,
      firebaseKey,
      razorpayKey,
      razorpayId,
      socialContent,
      siteKeyword,
      favicon,
      siteLogo,
      siteMiniLogo,
      sitePreloader,
      loginImage,
      siteTitle,
      siteAuthorName,
      siteDescription,
      enrollmentWord,
      copyrightText,
      applicationName,
      tagline,
      HeaderIcon,
      mobileLogo,
      facebookLink,
      linkedinLink,
      instagramLink,
      whatsappLink,
      youtubeLink,
      helpLineNumber,
      helpEmail,
      onboardingImage1,
      onboardingContent1,
      onboardingImage2,
      onboardingContent2,
      onboardingImage3,
      onboardingContent3,
      subscriptionType,
      amount,
      sessionAllowed,
      bookmarkVideoImage,
      bookmarkQuestionImage,
      downloadVideoImage,
      studentAndroidMobileVersion,
      studentIosMobileVersion,
      parentAndroidMobileVersion,
      parentIosMobileVersion,
      androidAppUrl,
      iosAppUrl,
      parentPrimaryColor,
      parentSecondaryColor,
      parentBgColor,
      studentPrimaryColor,
      studentSecondaryColor,
      studentBgColor,
      type,
    } = req.body;
    const getInstructionSetting = await Setting.findOne({
      where: { type: type },
    });
    if (!getInstructionSetting) {
      return res
        .status(400)
        .send({ status: 400, message: msg.GENERAL_SETTING_NOT_FOUND });
    }

    let payload = {
      firebaseKey: firebaseKey,
      socialContent: socialContent,
      siteKeyword: siteKeyword,
      siteTitle: siteTitle,
      siteAuthorName: siteAuthorName,
      siteDescription: siteDescription,
      enrollmentWord: enrollmentWord,
      copyrightText: copyrightText,
      instruction: instruction,
      razorpayKey: razorpayKey,
      razorpayId: razorpayId,
      applicationName: applicationName,
      tagline: tagline,
      facebookLink: facebookLink,
      linkedinLink: linkedinLink,
      instagramLink: instagramLink,
      whatsappLink: whatsappLink,
      youtubeLink: youtubeLink,
      helpLineNumber: helpLineNumber,
      helpEmail: helpEmail,
      onboardingContent1: onboardingContent1,
      onboardingContent2: onboardingContent2,
      onboardingContent3: onboardingContent3,
      subscriptionType: subscriptionType,
      amount: amount,
      sessionAllowed: sessionAllowed,
      androidAppUrl: androidAppUrl,
      iosAppUrl: iosAppUrl,
      studentAndroidMobileVersion: studentAndroidMobileVersion,
      studentIosMobileVersion: studentIosMobileVersion,
      parentAndroidMobileVersion: parentAndroidMobileVersion,
      parentIosMobileVersion: parentIosMobileVersion,
      parentPrimaryColor: parentPrimaryColor,
      parentSecondaryColor: parentSecondaryColor,
      parentBgColor: parentBgColor,
      studentPrimaryColor: studentPrimaryColor,
      studentSecondaryColor: studentSecondaryColor,
      studentBgColor: studentBgColor,
      type: type,
    };

    //NOTE : favicon upload
    if (favicon && favicon.includes("base64")) {
      const uploadImage = await uploadFileS3(
        favicon,
        msg.SITE_SETTING_FOLDER_CREATED
      );
      payload = { ...payload, favicon: uploadImage.Key };
    }

    //NOTE : siteLogo upload
    if (siteLogo && siteLogo.includes("base64")) {
      const uploadImage = await uploadFileS3(
        siteLogo,
        msg.SITE_SETTING_FOLDER_CREATED
      );
      payload = { ...payload, siteLogo: uploadImage.Key };
    }

    //NOTE : siteMiniLogo upload
    if (siteMiniLogo && siteMiniLogo.includes("base64")) {
      const uploadImage = await uploadFileS3(
        siteMiniLogo,
        msg.SITE_SETTING_FOLDER_CREATED
      );
      payload = { ...payload, siteMiniLogo: uploadImage.Key };
    }

    //NOTE : sitePreloader upload
    if (sitePreloader && sitePreloader.includes("base64")) {
      const uploadImage = await uploadFileS3(
        sitePreloader,
        msg.SITE_SETTING_FOLDER_CREATED
      );
      payload = { ...payload, sitePreloader: uploadImage.Key };
    }

    //NOTE : loginImage upload
    if (loginImage && loginImage.includes("base64")) {
      const uploadImage = await uploadFileS3(
        loginImage,
        msg.SITE_SETTING_FOLDER_CREATED
      );
      payload = { ...payload, loginImage: uploadImage.Key };
    }

    //NOTE : loginImage upload
    if (loginImage && loginImage.includes("base64")) {
      const uploadImage = await uploadFileS3(
        loginImage,
        msg.SITE_SETTING_FOLDER_CREATED
      );
      payload = { ...payload, loginImage: uploadImage.Key };
    }

    //NOTE : HeaderIcon upload
    if (HeaderIcon && HeaderIcon.includes("base64")) {
      const uploadImage = await uploadFileS3(
        HeaderIcon,
        msg.SITE_SETTING_FOLDER_CREATED
      );
      payload = { ...payload, HeaderIcon: uploadImage.Key };
    }
    //NOTE : mobileLogo upload
    if (mobileLogo && mobileLogo.includes("base64")) {
      const uploadImage = await uploadFileS3(
        mobileLogo,
        msg.SITE_SETTING_FOLDER_CREATED
      );
      payload = { ...payload, mobileLogo: uploadImage.Key };
    }

    //NOTE : onboardingImage 1 upload
    if (onboardingImage1 && onboardingImage1.includes("base64")) {
      const uploadImage = await uploadFileS3(
        onboardingImage1,
        msg.SITE_SETTING_FOLDER_CREATED
      );
      payload = { ...payload, onboardingImage1: uploadImage.Key };
    }
    //NOTE : onboardingImage 2 upload
    if (onboardingImage2 && onboardingImage2.includes("base64")) {
      const uploadImage = await uploadFileS3(
        onboardingImage2,
        msg.SITE_SETTING_FOLDER_CREATED
      );
      payload = { ...payload, onboardingImage2: uploadImage.Key };
    }

    //NOTE : onboardingImage 3 upload
    if (onboardingImage3 && onboardingImage3.includes("base64")) {
      const uploadImage = await uploadFileS3(
        onboardingImage3,
        msg.SITE_SETTING_FOLDER_CREATED
      );
      payload = { ...payload, onboardingImage3: uploadImage.Key };
    }

    //NOTE - bookmark video images
    if (bookmarkVideoImage && bookmarkVideoImage.includes("base64")) {
      const uploadImage = await uploadFileS3(
        bookmarkVideoImage,
        msg.BOOKMARK_IMAGES_FOLDER
      );
      payload = { ...payload, bookmarkVideoImage: uploadImage.Key };
    }

    //NOTE - bookmark question images
    if (bookmarkQuestionImage && bookmarkQuestionImage.includes("base64")) {
      const uploadImage = await uploadFileS3(
        bookmarkQuestionImage,
        msg.BOOKMARK_IMAGES_FOLDER
      );
      payload = { ...payload, bookmarkQuestionImage: uploadImage.Key };
    }

    //NOTE - download question images
    if (downloadVideoImage && downloadVideoImage.includes("base64")) {
      const uploadImage = await uploadFileS3(
        downloadVideoImage,
        msg.BOOKMARK_IMAGES_FOLDER
      );
      payload = { ...payload, downloadVideoImage: uploadImage.Key };
    }

    await Setting.update(payload, {
      where: { type: type },
    });

    return res.status(200).send({
      status: 200,
      message: msg.GENERAL_SETTING_UPDATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR: get all SETTING by type
const getOnlySiteSetting = async (req, res) => {
  try {
    const getInstructionSetting = await Setting.findOne({
      where: {
        type: "siteSetting",
      },
      attributes: [
        "socialContent",
        "siteKeyword",
        "favicon",
        "siteLogo",
        "siteMiniLogo",
        "sitePreloader",
        "loginImage",
        "siteTitle",
        "siteAuthorName",
        "siteDescription",
        "enrollmentWord",
        "copyrightText",
        "helpLineNumber",
        "helpEmail",
        "bookmarkVideoImage",
        "bookmarkQuestionImage",
        "downloadVideoImage",
        "subscriptionType",
      ],
    });

    const bookmarkImages = await Setting.findOne({
      where: {
        type: "bookmarkImages",
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    //NOTE - mobile data
    const mobileApp = await Setting.findOne({
      where: {
        type: "mobileApp",
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (!getInstructionSetting) {
      return res.status(200).send({
        status: 200,
        message: msg.GENERAL_SETTING_NOT_FOUND,
      });
    }

    (getInstructionSetting.facebookLink = mobileApp.facebookLink),
      (getInstructionSetting.linkedinLink = mobileApp.linkedinLink),
      (getInstructionSetting.whatsappLink = mobileApp.whatsappLink),
      (getInstructionSetting.youtubeLink = mobileApp.youtubeLink),
      (getInstructionSetting.instagramLink = mobileApp.instagramLink),
      (getInstructionSetting.bookmarkVideoImage = await getSignedUrlCloudFront(
        bookmarkImages?.bookmarkVideoImage
      ));
    getInstructionSetting.bookmarkQuestionImage = await getSignedUrlCloudFront(
      bookmarkImages?.bookmarkQuestionImage
    );
    getInstructionSetting.downloadVideoImage = await getSignedUrlCloudFront(
      bookmarkImages.downloadVideoImage
    );

    getInstructionSetting.favicon = await getSignedUrlCloudFront(
      getInstructionSetting?.favicon
    );
    getInstructionSetting.siteLogo = await getSignedUrlCloudFront(
      getInstructionSetting?.siteLogo
    );
    getInstructionSetting.siteMiniLogo = await getSignedUrlCloudFront(
      getInstructionSetting?.siteMiniLogo
    );
    getInstructionSetting.sitePreloader = await getSignedUrlCloudFront(
      getInstructionSetting?.sitePreloader
    );
    getInstructionSetting.loginImage = await getSignedUrlCloudFront(
      getInstructionSetting?.loginImage
    );

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: getInstructionSetting,
    });
  } catch (err) {
    return res
      .status(200)
      .send({ status: 200, message: msg.GENERAL_SETTING_NOT_FOUND });
  }
};

//ANCHOR: Get all SETTING for admin only
const getSettingForAdmin = async (req, res) => {
  try {
    //NOTE - Get all setting for admin
    const getInstructionSetting = await Setting.findOne({
      where: { type: "admin" },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    //NOTE - if setting not find
    if (!getInstructionSetting)
      return res.status(400).send({
        status: 400,
        message: msg.GENERAL_SETTING_NOT_FOUND,
      });

    //NOTE - If find data
    const result = {
      socialContent: getInstructionSetting.socialContent,
      siteKeyword: getInstructionSetting.siteKeyword,
      siteTitle: getInstructionSetting.siteTitle,
      siteAuthorName: getInstructionSetting.siteAuthorName,
      siteDescription: getInstructionSetting.siteDescription,
      siteKeyword: getInstructionSetting.siteKeyword,
      favicon: await getSignedUrlCloudFront(getInstructionSetting?.favicon),
      siteLogo: await getSignedUrlCloudFront(getInstructionSetting.siteLogo),
      siteMiniLogo: await getSignedUrlCloudFront(
        getInstructionSetting.siteMiniLogo
      ),
      sitePreloader: await getSignedUrlCloudFront(
        getInstructionSetting.sitePreloader
      ),
      loginImage: await getSignedUrlCloudFront(
        getInstructionSetting?.loginImage
      ),
    };

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: result,
    });
  } catch (err) {
    return res
      .status(200)
      .send({ status: 200, message: msg.GENERAL_SETTING_NOT_FOUND });
  }
};

//ANCHOR: get bookmark images
const getBookmarkImages = async (req, res) => {
  try {
    const getInstructionSetting = await Setting.findOne({
      where: { type: "bookmarkImages" },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    if (!getInstructionSetting)
      return res.status(200).send({
        status: 200,
        message: msg.GENERAL_SETTING_NOT_FOUND,
      });

    getInstructionSetting.bookmarkVideoImage = await getSignedUrlCloudFront(
      getInstructionSetting?.bookmarkVideoImage
    );
    getInstructionSetting.bookmarkQuestionImage = await getSignedUrlCloudFront(
      getInstructionSetting?.bookmarkQuestionImage
    );
    getInstructionSetting.downloadVideoImage = await getSignedUrlCloudFront(
      getInstructionSetting.downloadVideoImage
    );

    //NOTE - final result
    const result = {
      bookmarkVideoImage: getInstructionSetting.bookmarkVideoImage,
      bookmarkQuestionImage: getInstructionSetting.bookmarkQuestionImage,
      downloadVideoImage: getInstructionSetting.downloadVideoImage,
    };

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: result,
    });
  } catch (err) {
    return res
      .status(200)
      .send({ status: 200, message: msg.GENERAL_SETTING_NOT_FOUND });
  }
};

module.exports = {
  createInstruction,
  getAllInstruction,
  getInstructionById,
  updateInstructionById,
  deleteInstruction,
  getSettingByType,
  updateSettingByType,
  getOnlySiteSetting,
  getSettingForAdmin, //TODO - Will give only admin site setting
  getBookmarkImages,
};
