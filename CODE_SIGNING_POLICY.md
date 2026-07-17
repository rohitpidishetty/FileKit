# FileKit Code Signing Policy

## Project Overview

FileKit is a free and open-source desktop file management and analytics application built using Electron.js, React, and Java.

FileKit is distributed under the **GNU General Public License v3.0 (GPL-3.0)**.

## Code Signing Service

Official Windows releases of FileKit are digitally signed using **SignPath.io**.

Free code signing is provided by **SignPath.io**, with a certificate provided by the **SignPath Foundation**.

## Signed Artifacts

The following official release artifacts may be signed:

- Windows installer (`FileKit-Setup.exe`)
- Application executable (`FileKit.exe`)
- Executable files included in official FileKit release packages
- Java runtime and JAR files included with official distributions, when applicable

## Build Process

Official releases are:

1. Built exclusively from the public FileKit GitHub repository.
2. Produced automatically using GitHub Actions.
3. Built using GitHub-hosted runners.
4. Submitted directly to SignPath.io for signing.
5. Released only after successful signing.

Locally built binaries are **not** considered official releases.

## Roles

### Project Maintainer

**Er. P. Rohit V. Acharya**

### Signing Approver

**Er. P. Rohit V. Acharya**

Additional maintainers or signing approvers may be added in future releases.

## Security

- Only binaries generated from the official GitHub repository are eligible for signing.
- Private signing keys are **never stored** in this repository.
- Code signing certificates and private keys are securely managed by **SignPath Foundation**.
- API tokens or signing credentials are stored only as encrypted GitHub Secrets.

## Privacy

FileKit performs all file management operations locally on the user's computer.

FileKit does not collect, transmit, sell, or share personal information unless explicitly documented for a feature requiring network communication.

## Verifying a Release

To verify the authenticity of a FileKit release:

1. Right-click the executable.
2. Select **Properties**.
3. Open the **Digital Signatures** tab.
4. Verify that the signature is valid.

Only releases published through the official FileKit GitHub repository should be considered authentic.

## Contact

Questions regarding release authenticity or code signing may be submitted through GitHub Issues.

---

© FileKit Project  
Licensed under the GNU General Public License v3.0.
