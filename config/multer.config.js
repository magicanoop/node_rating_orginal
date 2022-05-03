const multer = require('multer');
const { ensureDir } = require('fs-extra');
const { logger } = require('./index');

function fileFilter(req, file, cb) {
  if (file.mimetype.split('/')[0] === 'image') cb(undefined, true);
  else cb(new Error('Only image files are allowed!'), false);
}

const portfolioStorage = multer.diskStorage({
  destination(req, file, cb) {
    const dir = `public/stag/${req.body.mobile}/image/portfolio_image`;
    ensureDir(dir)
      .then(() => cb(null, dir))
      .catch((err) => {
        logger.error(err, 'multerConfig -> storage -> destination:');
        cb(null, dir);
      });
  },

  filename(req, file, cb) {
    const uniqueName = new Date().getTime() + file.originalname;
    cb(null, uniqueName);
  },
});

const selfIntroVideoStorage = multer.diskStorage({
  destination(req, file, cb) {
    const dir = `public/stag/${req.body.mobile}/self-intro-video`;
    ensureDir(dir)
      .then(() => cb(null, dir))
      .catch((err) => {
        logger.error(err, 'multerConfig -> storage -> destination:');
        cb(null, dir);
      });
  },

  filename(req, file, cb) {
    const uniqueName = new Date().getTime() + file.originalname;
    cb(null, uniqueName);
  },
});


const portfolioVideoStorage = multer.diskStorage({
  destination(req, file, cb) {
    const dir = `public/stag/${req.body.mobile}/portfolio_video`;
    ensureDir(dir)
      .then(() => cb(null, dir))
      .catch((err) => {
        logger.error(err, 'multerConfig -> storage -> destination:');
        cb(null, dir);
      });
  },

  filename(req, file, cb) {
    const uniqueName = new Date().getTime() + file.originalname;
    cb(null, uniqueName);
  },
});

const stagImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = `public/stag/${req.body.mobile}/image`;

    ensureDir(dir)
      .then(() => cb(null, dir))
      .catch((err) => {
        logger.error(err, 'multerConfig -> storage -> destination:');
        cb(null, dir);
      });
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + file.originalname);
  }
});

const clubImageStorage = multer.diskStorage({
  destination(req, file, cb) {
    const dir = `public/club/${req.body.mobile}/image`;

    ensureDir(dir)
      .then(() => cb(null, dir))
      .catch((err) => {
        logger.error(err, 'multerConfig -> storage -> destination:');
        cb(null, dir);
      });
  },

  filename(req, file, cb) {
    const uniqueName = new Date().getTime() + file.originalname;
    cb(null, uniqueName);
  },
});

const personalDocStorage = multer.diskStorage({
  destination(req, file, cb) {
    const dir = `public/stag/${req.body.mobile}/personal_document`;
    ensureDir(dir)
      .then(() => cb(null, dir))
      .catch((err) => {
        logger.error(err, 'multerConfig -> storage -> destination:');
        cb(null, dir);
      });
  },

  filename(req, file, cb) {
    const uniqueName = new Date().getTime() + file.originalname;
    cb(null, uniqueName);
  },
});

const multerStagImage = multer({ fileFilter, storage: stagImageStorage });
const multerPortfolioImage = multer({ fileFilter, storage: portfolioStorage })
const multerClubImage = multer({ fileFilter, storage: clubImageStorage });
const multerPortfolioVideo = multer({ storage: portfolioVideoStorage });
const multerPersonalDocument = multer({ storage: personalDocStorage });
const multerSelfIntroVideo = multer({ storage: selfIntroVideoStorage })

module.exports = {
  multerStagImage,
  multerClubImage,
  multerPortfolioImage,
  multerPortfolioVideo,
  multerPersonalDocument,
  multerSelfIntroVideo
}