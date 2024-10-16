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
	[Nickname] VARCHAR(16),
	YearOfBirth VARCHAR(4),
	Email VARCHAR(MAX)
)

CREATE TABLE Word (
	Id INT IDENTITY(1,1) PRIMARY KEY,
	WordText VARCHAR(20) NOT NULL UNIQUE,
	[ShortDefinition] NVARCHAR(MAX),
	IllustrationImage VARCHAR(MAX),
	[Type] VARCHAR(8),
	[IsActive] BIT
)

CREATE TABLE [Definition] (
	Id INT IDENTITY(1,1) PRIMARY KEY,
	Detail NVARCHAR(MAX)
)

CREATE TABLE Word_Definition (
	WordId INT FOREIGN KEY REFERENCES Word(Id),
	DefinitionId INT FOREIGN KEY REFERENCES [Definition](Id),
	PRIMARY KEY (WordId, DefinitionId)
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

CREATE TABLE PendingWord (
	Id INT IDENTITY(1,1) PRIMARY KEY,
	UserId INT FOREIGN KEY REFERENCES[User](Id),
	WordId INT FOREIGN KEY REFERENCES Word(Id),
)


/*******************************************************************************
   Data
********************************************************************************/
INSERT INTO Word (WordText, [ShortDefinition], IllustrationImage, [Type], IsActive) VALUES 
	('Apple', N'Quả táo', '', 'Noun', 1)

INSERT INTO [User](Username,  [password], [IsActive], [Role]) values
	('admin', '12345678', 1, 'Admin system')