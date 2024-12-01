-- CreateTable
CREATE TABLE `Application` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `jobPostingId` INTEGER NOT NULL,
    `status` ENUM('PENDING', 'INTERVIEW', 'ACCEPTED', 'REJECTED', 'WITHDRAWN') NOT NULL,
    `appliedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `resumeUrl` VARCHAR(191) NULL,
    `coverLetter` VARCHAR(191) NULL,

    INDEX `Application_jobPostingId_fkey`(`jobPostingId`),
    INDEX `Application_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Bookmark` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `jobPostingId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Bookmark_jobPostingId_fkey`(`jobPostingId`),
    INDEX `Bookmark_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Company` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `address` VARCHAR(191) NULL,
    `companySize` ENUM('LARGE_COMPANY', 'SMALL_COMPANY', 'MEDIUM_COMPANY', 'STARTUP', 'PUBLIC', 'OTHER') NOT NULL,
    `employeeCount` INTEGER NOT NULL,
    `establishedDate` DATETIME(3) NOT NULL,
    `industry` VARCHAR(191) NULL,
    `introduction` VARCHAR(191) NOT NULL,
    `operatingProfit` DOUBLE NOT NULL,
    `revenue` DOUBLE NOT NULL,
    `website` VARCHAR(191) NULL,
    `welfareBenefits` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JobPosting` (
    `id` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `location` VARCHAR(191) NOT NULL,
    `companyId` INTEGER NOT NULL,
    `closingDate` DATETIME(3) NOT NULL,
    `jobType` ENUM('FULL_TIME', 'CONTRACT', 'INTERN') NOT NULL,
    `salary` INTEGER NOT NULL,
    `requirements` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `educationLevel` ENUM('HIGH_SCHOOL', 'ASSOCIATES_DEGREE', 'BACHELORS_DEGREE', 'MASTERS_DEGREE', 'DOCTORATE', 'NOT_SPECIFIED') NOT NULL,
    `isSalaryDetermined` BOOLEAN NOT NULL,
    `jobPosition` ENUM('PLANNING_STRATEGY', 'MARKETING_PR', 'ACCOUNTING_TAX_FINANCE', 'HR_LABOR_HRD', 'GENERAL_ADMIN_LEGAL', 'IT_DEV_DATA', 'DESIGN', 'SALES_MARKETING_TRADE', 'CUSTOMER_SERVICE_TM', 'PURCHASING_MATERIALS_LOGISTICS', 'PRODUCT_PLANNING_MD', 'DRIVER_TRANSPORT_DELIVERY', 'SERVICE', 'PRODUCTION', 'CONSTRUCTION_ARCHITECTURE', 'MEDICAL', 'RESEARCH_RND', 'EDUCATION', 'MEDIA_CULTURE_SPORTS', 'FINANCE_INSURANCE', 'PUBLIC_WELFARE') NOT NULL,
    `region` ENUM('SEOUL', 'GYEONGGI', 'GWANGJU', 'DAEGU', 'DAEJEON', 'BUSAN', 'ULSAN', 'INCHEON', 'GANGWON', 'GYEONGNAM', 'GYEONGBUK', 'JEONNAM', 'JEONBUK', 'CHUNGBUK', 'CHUNGNAM', 'JEJU', 'SEJONG') NOT NULL,
    `views` INTEGER NOT NULL DEFAULT 0,

    INDEX `JobPosting_companyId_fkey`(`companyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `hashedPassword` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER',

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Application` ADD CONSTRAINT `Application_jobPostingId_fkey` FOREIGN KEY (`jobPostingId`) REFERENCES `JobPosting`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Application` ADD CONSTRAINT `Application_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bookmark` ADD CONSTRAINT `Bookmark_jobPostingId_fkey` FOREIGN KEY (`jobPostingId`) REFERENCES `JobPosting`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bookmark` ADD CONSTRAINT `Bookmark_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JobPosting` ADD CONSTRAINT `JobPosting_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
