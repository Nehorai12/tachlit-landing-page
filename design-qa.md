## Hero text-fit QA

Source visual truth: `C:\Users\Daniel\Desktop\76d018a4-c63b-4523-9e25-0964c7d43c69.jpeg`.

Implementation evidence: `C:\Users\Daniel\.codex\visualizations\2026\08\15\01a00705-bcab-7841-8ad4-67f2449c7f3c\hero-mobile-text-fit.png` and `C:\Users\Daniel\.codex\visualizations\2026\08\15\01a00705-bcab-7841-8ad4-67f2449c7f3c\hero-visual-comparison.png`.

Viewport and state: top of the landing page at a 390 x 844 browser viewport. The page content viewport measured 375 x 844 because of the vertical scrollbar. The reference source is 941 x 1674 pixels and was rendered at 390 pixels wide for the comparison; the implementation capture is 390 x 844 CSS pixels at device scale factor 1.

### Comparison history

The first mobile capture showed the heading rendering beneath the portrait: the old mobile rules, later in `css/styles.css`, restored an 11vw headline and a narrower text grid column. The final mobile override is last in the stylesheet, reserves the portrait width with `clamp(7.7rem, 36vw, 9rem)`, and sizes the heading from the remaining text column.

Final focused-region evidence at the 390px viewport: the portrait occupies x=20 through x=160; the widest highlighted title word begins at x=169. The nine-pixel gap prevents the title from going behind the image. The 320px fallback changes to a one-column layout, placing the portrait below the copy so this relationship remains true on very narrow screens.

### Required fidelity surfaces

Fonts and typography: the Hebrew headline remains a heavy Heebo treatment, with a fluid `clamp()` size and no wrapping inside individual title lines. It is slightly more compact than the reference at the narrowest viewport, which is necessary to retain the supplied portrait without overlap.

Spacing and layout rhythm: the desktop composition remains two-column. On mobile the text and portrait have distinct grid tracks; below 360px they stack. The badge, copy, action, and credentials remain reachable and visible.

Colors and tokens: deep navy background, ivory copy, olive emphasis, and cyan action treatment retain the intended reference language.

Image quality and asset fidelity: the hero uses the requested `assets/image-1.jpeg` portrait, retained as a straight vertical crop.

Copy and content: the existing Hebrew conversion copy and working contact anchors are preserved. Pill navigation remains omitted on mobile by prior direction; the hamburger menu remains the navigation control.

### Findings

No actionable P0, P1, or P2 issues remain for the reported headline/portrait overlap. The temporary visual-comparison page logged a missing favicon only; this does not affect the landing page.

### Follow-up polish

P3: the reference uses a more condensed display face than the available Heebo font. A licensed or explicitly chosen Hebrew display font could make the headline even closer without changing the responsive layout.

final result: passed
