const gravatar = require('gravatar');
const multer = require('multer');
const jimp = require('jimp');
const path = require('path');
const fs = require('fs').promises;

// Папка для завантаження файлів
const uploadDir = path.join(__dirname, '..', 'public', 'avatars');

// Налаштування Multer для завантаження файлів
const upload = multer({ dest: path.join(__dirname, '..', 'tmp') });

const uploadAvatar = upload.single('avatar');

const updateUserAvatar = async (req, res) => {
  try {
    // Завантаження аватарки
    uploadAvatar(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: 'Avatar upload error' });
      }

      // Обробка та збереження аватарки
      const image = await jimp.read(req.file.path);
      await image.cover(250, 250).writeAsync(req.file.path);

      const user = req.user;
      const avatarFileName = `${user._id}${path.extname(req.file.originalname)}`;
      const avatarPath = path.join(uploadDir, avatarFileName);

      await fs.rename(req.file.path, avatarPath);

      // Оновлення URL аватарки користувача
      user.avatarURL = `/avatars/${avatarFileName}`;
      await user.save();

      res.status(200).json({ avatarURL: user.avatarURL });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  updateUserAvatar,
};