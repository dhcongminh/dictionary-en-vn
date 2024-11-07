USE [master]
GO
/*******************************************************************************
   Drop database if it exists
********************************************************************************/
IF EXISTS (SELECT name FROM master.dbo.sysdatabases WHERE name = N'Dictionary_en_vn')
BEGIN
	ALTER DATABASE Dictionary_en_vn SET SINGLE_USER WITH ROLLBACK IMMEDIATE
	DROP DATABASE Dictionary_en_vn
END

GO
 
CREATE  DATABASE Dictionary_en_vn
GO

USE Dictionary_en_vn


/*******************************************************************************
   Tables
********************************************************************************/
CREATE TABLE [User] (
	Id INT IDENTITY(1,1) PRIMARY KEY,
	Username VARCHAR(16),
	[Password] VARCHAR(MAX),
	[Role] VARCHAR(16),
	[IsActive] BIT
)

CREATE TABLE UserDetail (
	UserId INT FOREIGN KEY REFERENCES[User](Id) PRIMARY KEY,
	[Nickname] NVARCHAR(16),
	YearOfBirth VARCHAR(4),
	Email VARCHAR(MAX)
)

CREATE TABLE Word (
	Id INT IDENTITY(1,1) PRIMARY KEY,
	WordText VARCHAR(100) NOT NULL UNIQUE,
	[ShortDefinition] NVARCHAR(MAX),
	Phonetic NVARCHAR(MAX),
	AddByUser INT FOREIGN KEY REFERENCES [User](Id),
	[Status] VARCHAR(10)
)

CREATE TABLE [Type] (
	Id INT IDENTITY (1,1) PRIMARY KEY,
	Title NVARCHAR(20)
)

CREATE TABLE [Definition] (
	Id INT IDENTITY (1,1) PRIMARY KEY,
	[Detail] NVARCHAR(MAX),
) 

CREATE TABLE Example (
	Id INT IDENTITY (1,1) PRIMARY KEY,
	DefinitionId INT FOREIGN KEY REFERENCES [Definition](Id),
	Detail  NVARCHAR(MAX)
)

CREATE TABLE [Word_Definition] (
	Id INT IDENTITY (1,1) PRIMARY KEY,
	WordId INT FOREIGN KEY REFERENCES Word(Id),
	TypeId INT FOREIGN KEY REFERENCES [Type](Id),
	DefinitionId INT FOREIGN KEY REFERENCES [Definition](Id) UNIQUE
)


CREATE TABLE Favourite (
	UserId INT FOREIGN KEY REFERENCES [User](Id),
	WordId INT FOREIGN KEY REFERENCES Word(Id),
	PRIMARY KEY (WordId, UserId)
)

CREATE TABLE Synonyms_Word (
	WordId INT FOREIGN KEY REFERENCES Word(Id),
	SynonymsId INT FOREIGN KEY REFERENCES Word(Id),
	PRIMARY KEY (WordId, SynonymsId)
)

CREATE TABLE Antonyms_Word (
	WordId INT FOREIGN KEY REFERENCES Word(Id),
	AntonymsId INT FOREIGN KEY REFERENCES Word(Id),
	PRIMARY KEY (WordId, AntonymsId)
)


CREATE TABLE WordSet (
	Id INT IDENTITY(1, 1) PRIMARY KEY,
	UserId INT FOREIGN KEY REFERENCES [User](Id),
	NameOfSet NVARCHAR(MAX),

)

CREATE TABLE WordSetItem (
	WordSetId INT FOREIGN KEY REFERENCES WordSet(Id),
	WordId INT FOREIGN KEY REFERENCES Word(Id),
	PRIMARY KEY (WordSetId, WordId),
)

/*******************************************************************************
   Data
********************************************************************************/
INSERT INTO [Type](Title) VALUES 
(N'Động từ'),
(N'Danh từ'),
(N'Tính từ'),
(N'Trạng từ'),
(N'Đại từ'),
(N'Từ hạn định'),
(N'Thán từ'),
(N'Liên từ'),
(N'Giới từ');

INSERT INTO [User] (Username, [Password], [Role], IsActive)
VALUES ('admin', '12341234', 'Admin system', 1);
INSERT INTO [UserDetail] (UserId, Email)
VALUES (1, 'admin@dictionary.com');

/*******************************************************************************
   Index
********************************************************************************/
GO
CREATE INDEX IDX_SynonymsId
ON Synonyms_Word (SynonymsId);
GO
CREATE INDEX IDX_AntonymsId
ON Antonyms_Word (AntonymsId);
GO
CREATE INDEX IDX_WordText
ON Word (Id);
GO
CREATE INDEX IDX_WordId 
ON Word (WordText);
GO
CREATE INDEX IDX_Word_Definition
ON Word_Definition (DefinitionId);
/*******************************************************************************
   Triggers
********************************************************************************/
GO
CREATE TRIGGER OnCreateAntonyms_Word
ON Antonyms_Word
AFTER INSERT
AS
BEGIN
	DECLARE @InsertedId INT;
	DECLARE @WordId INT;

	DECLARE @InsertedWords TABLE (AntonymsId INT, WordId INT);
	INSERT INTO @InsertedWords (AntonymsId, WordId)
    SELECT AntonymsId, WordId FROM inserted;

	DECLARE cur CURSOR FOR SELECT AntonymsId, WordId FROM @InsertedWords;
    OPEN cur;
    FETCH NEXT FROM cur INTO @InsertedId, @WordId;

	WHILE @@FETCH_STATUS = 0
	BEGIN
		INSERT INTO Antonyms_Word(WordId, AntonymsId)
		VALUES (@InsertedId, @WordId);
		FETCH NEXT FROM cur INTO @InsertedId, @WordId;
	END;
	CLOSE cur;
    DEALLOCATE cur;
END;
GO
GO
CREATE TRIGGER OnCreateSynonyms_Word
ON Synonyms_Word
AFTER INSERT
AS
BEGIN
	DECLARE @InsertedId INT;
	DECLARE @WordId INT;

	DECLARE @InsertedWords TABLE (SynonymsId INT, WordId INT);
	INSERT INTO @InsertedWords (SynonymsId, WordId)
    SELECT SynonymsId, WordId FROM inserted;

	DECLARE cur CURSOR FOR SELECT SynonymsId, WordId FROM @InsertedWords;
    OPEN cur;
    FETCH NEXT FROM cur INTO @InsertedId, @WordId;

	WHILE @@FETCH_STATUS = 0
	BEGIN
		INSERT INTO Synonyms_Word(WordId, SynonymsId)
		VALUES (@InsertedId, @WordId);
		FETCH NEXT FROM cur INTO @InsertedId, @WordId;
	END;
	CLOSE cur;
    DEALLOCATE cur;
END;
GO
CREATE TRIGGER OnDeleteAntonyms_Word
ON Antonyms_Word
AFTER DELETE
AS
BEGIN
    DECLARE @DeletedAntonymsId INT;
    DECLARE @DeletedWordId INT;

    DECLARE @DeletedWords TABLE (AntonymsId INT, WordId INT);

    INSERT INTO @DeletedWords (AntonymsId, WordId)
    SELECT AntonymsId, WordId FROM deleted;

    DECLARE curAntonyms CURSOR FOR SELECT AntonymsId, WordId FROM @DeletedWords;
    OPEN curAntonyms;
    FETCH NEXT FROM curAntonyms INTO @DeletedAntonymsId, @DeletedWordId;

    WHILE @@FETCH_STATUS = 0
    BEGIN
		DELETE FROM Antonyms_Word
		WHERE WordId = @DeletedAntonymsId

        FETCH NEXT FROM curAntonyms INTO @DeletedAntonymsId, @DeletedWordId;
    END;
    CLOSE curAntonyms;
    DEALLOCATE curAntonyms;
END;
GO
CREATE TRIGGER OnDeleteSynonyms_Word
ON Synonyms_Word
AFTER DELETE
AS
BEGIN
    DECLARE @DeletedSynonymsId INT;
    DECLARE @DeletedWordId INT;

    DECLARE @DeletedWords TABLE (SynonymsId INT, WordId INT);

    INSERT INTO @DeletedWords (SynonymsId, WordId)
    SELECT SynonymsId, WordId FROM deleted;

    DECLARE curSynonyms CURSOR FOR SELECT SynonymsId, WordId FROM @DeletedWords;
    OPEN curSynonyms;
    FETCH NEXT FROM curSynonyms INTO @DeletedSynonymsId, @DeletedWordId;

    WHILE @@FETCH_STATUS = 0
    BEGIN
		DELETE FROM Synonyms_Word
		WHERE WordId = @DeletedSynonymsId

        FETCH NEXT FROM curSynonyms INTO @DeletedSynonymsId, @DeletedWordId;
    END;
    CLOSE curSynonyms;
    DEALLOCATE curSynonyms;
END;
GO
