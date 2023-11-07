-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `email_verified` BOOLEAN NOT NULL DEFAULT false,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_id_key`(`id`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `active_expires` BIGINT NOT NULL,
    `idle_expires` BIGINT NOT NULL,

    UNIQUE INDEX `Session_id_key`(`id`),
    INDEX `Session_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Key` (
    `id` VARCHAR(191) NOT NULL,
    `hashed_password` VARCHAR(191) NULL,
    `user_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Key_id_key`(`id`),
    INDEX `Key_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EmailVerificationToken` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `expires` BIGINT NOT NULL,

    UNIQUE INDEX `EmailVerificationToken_id_key`(`id`),
    INDEX `EmailVerificationToken_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PasswordResetToken` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `expires` BIGINT NOT NULL,

    UNIQUE INDEX `PasswordResetToken_id_key`(`id`),
    INDEX `PasswordResetToken_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
