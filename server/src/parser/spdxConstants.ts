
// SPDXに関する定数、定義的な判定基準
export class SpdxConstants {
    // commentField start character
    static readonly comment: '#';
    static readonly textStartTag: '<text>';
    static readonly textEndTag: '</text>';

    // the field to consider as the start of the entity
    static readonly entityStartField = [
        "SPDXVersion",
        "PackageName",
        "FileName",
        "SnippetSPDXID",
        "LicenseID",
        "Reviewer"
    ];

    // Document Creation Info
    static readonly documentCreationInfo = [
        "SPDXVersion",
        "DataLicense",
        "SPDXID",
        "DocumentName",
        "DocumentNamespace",
        "DocumentComment",
        "ExternalDocumentRef",
        "LicenseListVersion",
        "Creator",
        "Created",
        "CreatorComment"
    ];

    // Package Info
    static readonly packageInfo = [
        "PackageName",
        "SPDXID",
        "PackageVersion",
        "PackageFileName",
        "PackageSupplier",
        "PackageOriginator",
        "PackageDownloadLocation",
        "FilesAnalyzed",
        "PackageVerificationCode",
        "PackageChecksum",
        "PackageHomePage",
        "PackageSourceInfo",
        "PackageLicenseConcluded",
        "PackageLicenseInfoFromFiles",
        "PackageLicenseDeclared",
        "PackageLicenseComments",
        "PackageCopyrightText",
        "PackageSummary",
        "PackageDescription",
        "PackageComment",
        "ExternalRef",
        "ExternalRefComment",
        "PackageAttributionText"
    ];

    // File Info
    static readonly fileInfo = [
        "FileName",
        "SPDXID",
        "FileType",
        "FileChecksum",
        "LicenseConcluded",
        "LicenseInfoInFile",
        "LicenseComments",
        "FileCopyrightText",
        "ArtifactOfProjectName",
        "ArtifactOfProjectHomePage",
        "ArtifactOfProjectURI",
        "FileComment",
        "FileNotice",
        "FileContributor",
        "FileDependency",
        "FileAttributionText"
    ];

    // Snippet Info
    static readonly snippetInfo = [
        "SnippetSPDXID",
        "SnippetFromFileSPDXID",
        "SnippetByteRange",
        "SnippetLineRange",
        "SnippetLicenseConcluded",
        "LicenseInfoInSnippet",
        "SnippetLicenseComments",
        "SnippetCopyrightText",
        "SnippetComment",
        "SnippetName",
    ];

    // License Info
    static readonly licenseInfo = [
        "LicenseID",
        "ExtractedText",
        "LicenseName",
        "LicenseCrossReference",
        "LicenseComment"
    ];

    // Review Info (deprecated)
    static readonly reviewInfo = [
        "Reviewer",
        "ReviewDate",
        "ReviewComment"
    ];
    
    // Annotation
    static readonly annotation = [
        "Annotator",
        "AnnotationDate",
        "AnnotationType",
        "SPDXREF",
        "AnnotationComment"
    ];

    // Relationship
    static readonly relationship = [
        "Relationship",
        "RelationshipComment"
    ];
    
    static readonly multipleField = [
        // DocumentCreation Info
        "DocumentComment",
        "CreatorComment",
        // Package Info
        "PackageSourceInfo",
        "PackageLicenseComments",
        "PackageCopyrightText",
        "PackageSummary",
        "PackageDescription",
        "PackageComment",
        "ExternalRefComment",
        "PackageAttributionText",
        // File Info
        "LicenseComments",
        "FileCopyrightText",
        "FileComment",
        "FileNotice",
        "FileAttributionText",
        // Snippet Info
        "SnippetLicenseComments",
        "SnippetCopyrightText",
        "SnippetComment",
        "SnippetAttributionText",
        // License Info
        "ExtractedText",
        "LicenseComment",
        // Relationship
        "RelationshipComment",
        // Annotation
        "AnnotationComment",
        // Review Info
        "ReviewComment"
    ];

    // SPDX identifier
    static readonly spdxIDField = [
        "SPDXID",
        "SnippetSPDXID"
    ];

    // License identifier
    static readonly licenseField = [
        "PackageLicenseConcluded",
        "PackageLicenseDeclared",
        "LicenseConcluded",
        "SnippetLicenseConcluded"
    ];

    // External reference
    static readonly externalRefField = [
        "PackageLicenseConcluded",
        "PackageLicenseDeclared",
        "SnippetLicenseConcluded",
        "ExternalDocumentRef",
        "ExternalRef",
        "ExternalRefComment",
        "LicenseCrossReference",
    ];

    // single line fields
    static readonly lineField = [
        "SPDXVersion",
        "DataLicense",
        "SPDXID",
        "DocumentName",
        "DocumentNamespace",
        "ExternalDocumentRef",
        "LicenseListVersion",
        "Creator",
        "Created",
        "PackageName",
        "SPDXID",
        "PackageVersion",
        "PackageFileName",
        "PackageSupplier",
        "PackageOriginator",
        "PackageDownloadLocation",
        "FilesAnalyzed",
        "PackageVerificationCode",
        "PackageChecksum",
        "PackageHomePage",
        "PackageLicenseConcluded",
        "PackageLicenseInfoFromFiles",
        "PackageLicenseDeclared",
        "PackageCopyrightText",
        "ExternalRef",
        "FileName",
        "SPDXID",
        "FileType",
        "FileChecksum",
        "LicenseConcluded",
        "LicenseInfoInFile",
        "ArtifactOfProjectName",
        "ArtifactOfProjectHomePage",
        "ArtifactOfProjectURI",
        "FileContributor",
        "FileDependency",
        "SnippetSPDXID",
        "SnippetFromFileSPDXID",
        "SnippetByteRange",
        "SnippetLineRange",
        "SnippetLicenseConcluded",
        "LicenseInfoInSnippet",
        "SnippetName",
        "LicenseID",
        "LicenseName",
        "LicenseCrossReference",
        "Reviewer",
        "ReviewDate",
        "Annotator",
        "AnnotationDate",
        "AnnotationType",
        "SPDXREF",
        "Relationship"
    ];
}
