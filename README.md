# Features
## 🎨 Multi-Layouts
## 🔒 Custmize Templates
## 🔐 Watermark
## 🛡️ Authenticity Shield
The data injected into the **Authenticity Shield** is a **32-bit Unique Digital Fingerprint (UID)**.

Here is exactly what that means for your app:

1.  **A Pointer, Not the Content:** We don't inject the actual text of the headline (which would be too large and easy to break). Instead, we inject a short, encrypted ID that acts like a "License Plate."
2.  **Linked to the Database:** This 32-bit ID is a direct link to a record in your Supabase database. That record contains the **Original, Untampered Data**:
    *   The exact Headline
    *   The exact Photo used
    *   The Timestamp it was created
    *   The User who created it
3.  **The Comparison Loop:** When someone uploads a suspicious card to the "Verify" page:
    *   The system extracts the **32-bit Fingerprint**.
    *   It looks up the corresponding record in your database.
    *   It then compares the **Database Headline** with the **Image Headline**. If they don't match, the system warns: *"This card has been altered!"*

### Why only 32 bits?
By keeping the data small (32 bits), we ensure the watermark is **virtually indestructible**. It allows the shield to remain readable even if the image is heavily compressed on WhatsApp or screenshotted multiple times, without ever ruining the visual quality of the photocard.

## 🚀 Roadmap & Security Enhancements
- [ ] **Cross-Validation Verification (Option B):** Implement server-side storage of metadata (Headline, Image URL) for every generated card. During verification, the system will compare the visual content with the stored metadata to detect sophisticated "Browser Developer Tool" tampering.
- [ ] **Server-Side Font Rendering:** Support high-fidelity Bengali font rendering directly on the backend to remove reliance on client-side canvas capture.