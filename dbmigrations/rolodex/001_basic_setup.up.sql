CREATE TABLE IF NOT EXISTS public.alliances (
    "allianceID" INTEGER NOT NULL,
    "allianceName" TEXT NOT NULL,
    PRIMARY KEY("allianceID")
);

CREATE TABLE IF NOT EXISTS public.corporations (
    "corporationID" INTEGER NOT NULL,
    "corporationName" TEXT NOT NULL,
    "allianceID" INTEGER,
    PRIMARY KEY("corporationID")
);

CREATE TABLE IF NOT EXISTS public.characters (
    "characterID" INTEGER NOT NULL,
    "owner" TEXT NOT NULL,
    "characterName" TEXT,
    "corporationID" INTEGER,
    "refreshToken" TEXT NOT NULL,
    "lastUpdated" TIMESTAMP,
    "securityStatus" NUMERIC,
    "totalSkillpoints" INTEGER,
    "unallocatedSkillpoints" INTEGER,
    PRIMARY KEY("characterID")
);

CREATE TABLE IF NOT EXISTS public."characterAttributes" (
    "characterID" INTEGER NOT NULL,
    "charisma" INTEGER NOT NULL,
    "intelligence" INTEGER NOT NULL,
    "memory" INTEGER NOT NULL,
    "perception" INTEGER NOT NULL,
    "willpower" INTEGER NOT NULL,
    "bonusRemaps" INTEGER,
    "accruedRemapCooldown" TIMESTAMP,
    "lastRemapDate" TIMESTAMP,
    PRIMARY KEY("characterID")
);

CREATE TABLE IF NOT EXISTS public."characterSkills" (
    "characterSkillID" SERIAL NOT NULL,
    "characterID" INTEGER NOT NULL,
    "skillID" INTEGER NOT NULL,
    "skillpointsInSkill" INTEGER,
    "trainedSkillLevel" INTEGER,
    "activeSkillLevel" INTEGER,
    PRIMARY KEY("characterSkillID")
);

CREATE TABLE IF NOT EXISTS public."characterSkillQueue" (
    "queueEntryID" SERIAL NOT NULL,
    "characterID" INTEGER NOT NULL,
    "skillID" INTEGER NOT NULL,
    "queuePosition" INTEGER,
    "startDate" TIMESTAMP,
    "finishDate" TIMESTAMP,
    "finishedLevel" INTEGER,
    "trainingStartSP" INTEGER,
    "levelStartSP" INTEGER,
    "levelEndSP" INTEGER,
    PRIMARY KEY("queueEntryID")
);