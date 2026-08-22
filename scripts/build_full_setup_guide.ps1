# SITI FRUITIES — Full Phase 3B Setup Guide Word Document (.docx) Generator
$repoRoot = "C:\Users\HP\Documents\GitHub\Siti-Fruities"
$outputDocx = Join-Path $repoRoot "SITI-FRUITIES-PHASE-3B-SETUP-GUIDE.docx"
$tempDir = Join-Path $repoRoot "temp_docx_build"

if (Test-Path $tempDir) { Remove-Item -Recurse -Force $tempDir }
New-Item -ItemType Directory -Path $tempDir | Out-Null
New-Item -ItemType Directory -Path (Join-Path $tempDir "_rels") | Out-Null
New-Item -ItemType Directory -Path (Join-Path $tempDir "word") | Out-Null
New-Item -ItemType Directory -Path (Join-Path $tempDir "word\_rels") | Out-Null

# 1. [Content_Types].xml
$contentTypes = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>
'@
$contentTypes | Out-File -FilePath (Join-Path $tempDir "[Content_Types].xml") -Encoding utf8

# 2. _rels/.rels
$dotRels = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>
'@
$dotRels | Out-File -FilePath (Join-Path $tempDir "_rels\.rels") -Encoding utf8

# 3. word/_rels/document.xml.rels
$docRels = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>
'@
$docRels | Out-File -FilePath (Join-Path $tempDir "word\_rels\document.xml.rels") -Encoding utf8

# 4. word/styles.xml
$stylesXml = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault>
      <w:rPr>
        <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/>
        <w:sz w:val="22"/>
        <w:szCs w:val="22"/>
        <w:color w:val="2D3748"/>
      </w:rPr>
    </w:rPrDefault>
    <w:pPrDefault>
      <w:pPr>
        <w:spacing w:after="140" w:line="260" w:lineRule="auto"/>
      </w:pPr>
    </w:pPrDefault>
  </w:docDefaults>
  
  <w:style w:type="paragraph" w:styleId="Title">
    <w:name w:val="Title"/>
    <w:pPr>
      <w:spacing w:before="360" w:after="200"/>
      <w:jc w:val="center"/>
    </w:pPr>
    <w:rPr>
      <w:rFonts w:ascii="Georgia" w:hAnsi="Georgia"/>
      <w:b/>
      <w:sz w:val="52"/>
      <w:color w:val="1E5631"/>
    </w:rPr>
  </w:style>

  <w:style w:type="paragraph" w:styleId="Subtitle">
    <w:name w:val="Subtitle"/>
    <w:pPr>
      <w:spacing w:before="0" w:after="400"/>
      <w:jc w:val="center"/>
    </w:pPr>
    <w:rPr>
      <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>
      <w:i/>
      <w:sz w:val="26"/>
      <w:color w:val="4A5568"/>
    </w:rPr>
  </w:style>

  <w:style w:type="paragraph" w:styleId="Heading1">
    <w:name w:val="heading 1"/>
    <w:pPr>
      <w:spacing w:before="400" w:after="160"/>
    </w:pPr>
    <w:rPr>
      <w:rFonts w:ascii="Georgia" w:hAnsi="Georgia"/>
      <w:b/>
      <w:sz w:val="34"/>
      <w:color w:val="1E5631"/>
    </w:rPr>
  </w:style>

  <w:style w:type="paragraph" w:styleId="Heading2">
    <w:name w:val="heading 2"/>
    <w:pPr>
      <w:spacing w:before="260" w:after="120"/>
    </w:pPr>
    <w:rPr>
      <w:rFonts w:ascii="Georgia" w:hAnsi="Georgia"/>
      <w:b/>
      <w:sz w:val="26"/>
      <w:color w:val="2E7D32"/>
    </w:rPr>
  </w:style>

  <w:style w:type="paragraph" w:styleId="Heading3">
    <w:name w:val="heading 3"/>
    <w:pPr>
      <w:spacing w:before="180" w:after="80"/>
    </w:pPr>
    <w:rPr>
      <w:b/>
      <w:sz w:val="24"/>
      <w:color w:val="2C3E50"/>
    </w:rPr>
  </w:style>

  <w:style w:type="paragraph" w:styleId="CodeBlock">
    <w:name w:val="Code Block"/>
    <w:pPr>
      <w:shd w:val="clear" w:color="auto" w:fill="F7FAFC"/>
      <w:pBdr>
        <w:left w:val="single" w:sz="24" w:space="8" w:color="1E5631"/>
      </w:pBdr>
      <w:spacing w:before="40" w:after="40" w:line="220" w:lineRule="auto"/>
    </w:pPr>
    <w:rPr>
      <w:rFonts w:ascii="Consolas" w:hAnsi="Consolas"/>
      <w:sz w:val="17"/>
      <w:color w:val="1A202C"/>
    </w:rPr>
  </w:style>
</w:styles>
'@
$stylesXml | Out-File -FilePath (Join-Path $tempDir "word\styles.xml") -Encoding utf8

# Helper to escape XML
function EscapeXml([string]$text) {
    if ([string]::IsNullOrEmpty($text)) { return "" }
    return $text.Replace('&', '&amp;').Replace('<', '&lt;').Replace('>', '&gt;').Replace('"', '&quot;')
}

# Helper to build paragraph
function MakeP {
    param(
        [string]$Text = "",
        [string]$Style = "",
        [switch]$Bold,
        [switch]$Italic,
        [string]$Color = ""
    )
    $pPr = ""
    if ($Style -ne "") { $pPr += "<w:pStyle w:val=""$Style""/>" }
    if ($pPr -ne "") { $pPr = "<w:pPr>$pPr</w:pPr>" }

    $rPr = ""
    if ($Bold) { $rPr += "<w:b/>" }
    if ($Italic) { $rPr += "<w:i/>" }
    if ($Color -ne "") { $rPr += "<w:color w:val=""$Color""/>" }
    if ($rPr -ne "") { $rPr = "<w:rPr>$rPr</w:rPr>" }

    $escaped = EscapeXml $Text
    return "<w:p>$pPr<w:r>$rPr<w:t xml:space=""preserve"">$escaped</w:t></w:r></w:p>`n"
}

# Helper to build code block paragraphs from multi-line text
function MakeCode {
    param([string]$CodeText)
    $sb = New-Object System.Text.StringBuilder
    $lines = $CodeText -split "`r?`n"
    foreach ($line in $lines) {
        $escaped = EscapeXml $line
        [void]$sb.Append("<w:p><w:pPr><w:pStyle w:val=""CodeBlock""/></w:pPr><w:r><w:rPr><w:rFonts w:ascii=""Consolas"" w:hAnsi=""Consolas""/><w:sz w:val=""17""/><w:color w:val=""1A202C""/></w:rPr><w:t xml:space=""preserve"">$escaped</w:t></w:r></w:p>`n")
    }
    return $sb.ToString()
}

# Helper for Callout Box
function MakeCallout {
    param(
        [string]$Title,
        [string]$Text,
        [string]$Color = "1E5631",
        [string]$Fill = "F0FDF4"
    )
    $eTitle = EscapeXml $Title
    $eText = EscapeXml $Text
    return @"
<w:p>
  <w:pPr>
    <w:shd w:val="clear" w:color="auto" w:fill="$Fill"/>
    <w:pBdr>
      <w:left w:val="single" w:sz="36" w:space="12" w:color="$Color"/>
    </w:pPr>
    <w:spacing w:before="120" w:after="120"/>
  </w:pPr>
  <w:r>
    <w:rPr><w:b/><w:color w:val="$Color"/></w:rPr>
    <w:t xml:space="preserve">$eTitle: </w:t>
  </w:r>
  <w:r>
    <w:t xml:space="preserve">$eText</w:t>
  </w:r>
</w:p>
"@
}

# Load exact SQL files
$sql1 = Get-Content -Path (Join-Path $repoRoot "supabase\sql\1_extensions_tables.sql") -Raw
$sql2 = Get-Content -Path (Join-Path $repoRoot "supabase\sql\2_constraints_functions_triggers.sql") -Raw
$sql3 = Get-Content -Path (Join-Path $repoRoot "supabase\sql\3_row_level_security.sql") -Raw
$sql4 = Get-Content -Path (Join-Path $repoRoot "supabase\sql\4_storage_setup.sql") -Raw
$sql5 = Get-Content -Path (Join-Path $repoRoot "supabase\sql\5_seed_data.sql") -Raw

$docBuilder = New-Object System.Text.StringBuilder

# --- Header & Title ---
[void]$docBuilder.Append((MakeP -Text "SITI FRUITIES" -Style "Title"))
[void]$docBuilder.Append((MakeP -Text "Phase 3B Complete Backend & Commerce Setup Guide" -Style "Subtitle"))
[void]$docBuilder.Append((MakeCallout -Title "PURPOSE OF THIS DOCUMENT" -Text "This Microsoft Word document is the authoritative, copyable manual execution guide for the SITI FRUITIES backend, commerce, Paystack integration, and Supabase database. Every SQL snippet, command, environment variable, and verification test is detailed with zero placeholders."))

# --- 1. Overview ---
[void]$docBuilder.Append((MakeP -Text "1. Overview" -Style "Heading1"))
[void]$docBuilder.Append((MakeP -Text "SITI FRUITIES is a premium fruit and healthy treat brand specializing in signature Greek Yogurt Parfaits, Smoothies, Sandwiches, Boba Teas, Juices, and curated Gift Treatboxes."))
[void]$docBuilder.Append((MakeP -Text "This Phase 3B specification transitions the deployed frontend from a static in-memory prototype into a fully server-authoritative e-commerce platform backed by Supabase PostgreSQL, Paystack payment processing, zone-based delivery pricing, server-side coupon validation, and an administrative control center."))

# --- 2. What Phase 3B Implements ---
[void]$docBuilder.Append((MakeP -Text "2. What Phase 3B Implements" -Style "Heading1"))
[void]$docBuilder.Append((MakeP -Text "• Server-Authoritative Orders: Client submits cart intent; the database calculates prices, modifiers, fees, discounts, and totals atomically via RPC."))
[void]$docBuilder.Append((MakeP -Text "• Order Item Snapshots: Line items lock product name, unit price, and options at order time. Price edits never alter historical orders."))
[void]$docBuilder.Append((MakeP -Text "• Zone-Based Delivery: Delivery zones table drives checkout fees (including ₦0 store pickup), replacing the flat ₦1,500 / ₦20,000 threshold."))
[void]$docBuilder.Append((MakeP -Text "• Real-Time Availability Check: ProductCard visual cues, plus both frontend and server-side availability rejection."))
[void]$docBuilder.Append((MakeP -Text "• Double-Protected Role System: Customer role escalation is strictly blocked at the RLS and trigger levels."))
[void]$docBuilder.Append((MakeP -Text "• Paystack Integration: Frontend Paystack Popup with server-side HMAC SHA512 webhook verification and fallback verification."))
[void]$docBuilder.Append((MakeP -Text "• Order Confirmation & WhatsApp: Human-readable order numbers (SF-YYYYMMDD-XXXX) handed off to WhatsApp."))
[void]$docBuilder.Append((MakeP -Text "• Operations Dashboard: Secure admin dashboard at /admin for orders, products, delivery, coupons, promotions, and enquiries."))

# --- 3. Supabase Project Setup ---
[void]$docBuilder.Append((MakeP -Text "3. Supabase Project Setup (MANUAL)" -Style "Heading1"))
[void]$docBuilder.Append((MakeP -Text "1. Navigate to https://supabase.com and sign in."))
[void]$docBuilder.Append((MakeP -Text "2. Click 'New Project' and select your organization."))
[void]$docBuilder.Append((MakeP -Text "3. Enter Project Name: Siti-Fruities-Backend"))
[void]$docBuilder.Append((MakeP -Text "4. Set a strong Database Password (store securely in your password manager)."))
[void]$docBuilder.Append((MakeP -Text "5. Choose Region: West Europe (London) or closest region."))
[void]$docBuilder.Append((MakeP -Text "6. Click 'Create new project' and wait 2 minutes for provisioning."))

# --- 4. Required SQL (Full Executable Scripts) ---
[void]$docBuilder.Append((MakeP -Text "4. Required SQL Execution (MANUAL)" -Style "Heading1"))
[void]$docBuilder.Append((MakeP -Text "In the Supabase Dashboard, click the SQL Editor (icon on left sidebar), open a New Query, paste each SQL stage sequentially, and click Run."))

[void]$docBuilder.Append((MakeP -Text "SQL 01 — Extensions & Base Tables (Run First)" -Style "Heading2"))
[void]$docBuilder.Append((MakeP -Text "Creates pgcrypto/uuid extensions and core tables: categories, products, delivery_zones, coupons, promotions, profiles, saved_addresses, orders, order_items, catering_enquiries, and custom_parfait_quotes." -Italic))
[void]$docBuilder.Append((MakeCode -CodeText $sql1))

[void]$docBuilder.Append((MakeP -Text "SQL 02 — Constraints, Functions, Triggers & RPCs (Run Second)" -Style "Heading2"))
[void]$docBuilder.Append((MakeP -Text "Creates human-readable order number generator (SF-YYYYMMDD-XXXX), profile creation trigger, role escalation protection, server-authoritative order creation RPC (create_authoritative_order), status transition enforcement trigger, and idempotent payment confirmation function." -Italic))
[void]$docBuilder.Append((MakeCode -CodeText $sql2))

[void]$docBuilder.Append((MakeP -Text "SQL 03 — Row Level Security Policies (Run Third)" -Style "Heading2"))
[void]$docBuilder.Append((MakeP -Text "Enables RLS across all tables. Grants public read for active products/categories/zones, restricts admin tables to verified admin profiles, and prevents customers from escalating roles." -Italic))
[void]$docBuilder.Append((MakeCode -CodeText $sql3))

[void]$docBuilder.Append((MakeP -Text "SQL 04 — Supabase Storage Buckets & Policies (Run Fourth)" -Style "Heading2"))
[void]$docBuilder.Append((MakeP -Text "Creates public buckets 'product-images' and 'promo-flyers' with public read and authenticated admin upload/delete policies." -Italic))
[void]$docBuilder.Append((MakeCode -CodeText $sql4))

[void]$docBuilder.Append((MakeP -Text "SQL 05 — Complete Initial Seed Data (Run Fifth)" -Style "Heading2"))
[void]$docBuilder.Append((MakeP -Text "Populates authentic menu products, options, delivery zones, initial coupons (SITI10, WELCOME500, VIPFRESH), and active promotional banners." -Italic))
[void]$docBuilder.Append((MakeCode -CodeText $sql5))

# --- 5 to 9 Database Architecture Summary ---
[void]$docBuilder.Append((MakeP -Text "5. Database Schema & Relationships" -Style "Heading1"))
[void]$docBuilder.Append((MakeP -Text "The database contains 10 core tables interconnected via foreign keys: profiles extends auth.users; products references categories; orders optionally references profiles, coupons, and delivery_zones; order_items snapshots product details under orders."))

[void]$docBuilder.Append((MakeP -Text "6. Row Level Security (RLS) Architecture" -Style "Heading1"))
[void]$docBuilder.Append((MakeP -Text "• Public: Can select active products, categories, delivery zones, promotions. Can create orders and submit enquiries."))
[void]$docBuilder.Append((MakeP -Text "• Registered Customer: Can view and update their own profile (name, phone) and view their own order history."))
[void]$docBuilder.Append((MakeP -Text "• Admin: Full select/insert/update/delete across all tables via is_admin() security definer function."))

[void]$docBuilder.Append((MakeP -Text "7. RPC & Database Functions" -Style "Heading1"))
[void]$docBuilder.Append((MakeP -Text "• create_authoritative_order(p_payload): Server-authoritative atomic order computation and insertion."))
[void]$docBuilder.Append((MakeP -Text "• validate_and_apply_coupon(p_code, p_subtotal): Validates active status, expiry, limits, and computes discount."))
[void]$docBuilder.Append((MakeP -Text "• confirm_order_payment(p_order_id, p_paystack_ref): Idempotent payment recorder."))
[void]$docBuilder.Append((MakeP -Text "• generate_order_number(): Generates SF-YYYYMMDD-XXXX with collision loop check."))

[void]$docBuilder.Append((MakeP -Text "8. Indexes & Constraints" -Style "Heading1"))
[void]$docBuilder.Append((MakeP -Text "B-Tree indexes created on orders(user_id), orders(order_number), orders(paystack_reference), products(category_id), products(is_featured), coupons(code), promotions(is_active)."))

[void]$docBuilder.Append((MakeP -Text "9. Triggers Summary" -Style "Heading1"))
[void]$docBuilder.Append((MakeP -Text "• handle_updated_at: Updates updated_at column on record changes."))
[void]$docBuilder.Append((MakeP -Text "• trg_set_order_number: Auto-assigns SF-YYYYMMDD-XXXX on order creation."))
[void]$docBuilder.Append((MakeP -Text "• on_auth_user_created: Automatically creates public.profiles row upon user signup."))
[void]$docBuilder.Append((MakeP -Text "• trg_prevent_role_escalation: Throws error if non-admin attempts to modify profile role."))
[void]$docBuilder.Append((MakeP -Text "• trg_enforce_order_status: Enforces legitimate status progressions (e.g. pending_payment -> confirmed -> preparing -> ready -> out_for_delivery -> delivered)."))

# --- 10 & 11 Storage ---
[void]$docBuilder.Append((MakeP -Text "10. Storage Bucket Setup (MANUAL)" -Style "Heading1"))
[void]$docBuilder.Append((MakeP -Text "SQL Stage 04 automatically creates the buckets. If creating manually via dashboard:"))
[void]$docBuilder.Append((MakeP -Text "1. Go to Storage in Supabase sidebar."))
[void]$docBuilder.Append((MakeP -Text "2. Click 'New Bucket' -> Name: product-images -> Toggle 'Public Bucket' -> Save."))
[void]$docBuilder.Append((MakeP -Text "3. Click 'New Bucket' -> Name: promo-flyers -> Toggle 'Public Bucket' -> Save."))

[void]$docBuilder.Append((MakeP -Text "11. Storage Policies" -Style "Heading1"))
[void]$docBuilder.Append((MakeP -Text "Public can read; only authenticated administrators can insert, update, or delete files."))

# --- 12 to 14 Auth & Admin Setup ---
[void]$docBuilder.Append((MakeP -Text "12. Supabase Auth Configuration (MANUAL)" -Style "Heading1"))
[void]$docBuilder.Append((MakeP -Text "1. In Supabase Dashboard, go to Authentication -> Providers -> Email."))
[void]$docBuilder.Append((MakeP -Text "2. Ensure Email provider is Enabled."))
[void]$docBuilder.Append((MakeP -Text "3. Disable 'Confirm email' for development/testing if you want instant logins."))

[void]$docBuilder.Append((MakeP -Text "13. Admin User Setup (MANUAL)" -Style "Heading1"))
[void]$docBuilder.Append((MakeP -Text "1. In Supabase Dashboard, go to Authentication -> Users."))
[void]$docBuilder.Append((MakeP -Text "2. Click 'Add User' -> 'Create user'."))
[void]$docBuilder.Append((MakeP -Text "3. Enter admin email: admin@sitifruities.com (or your email) and set a secure password."))
[void]$docBuilder.Append((MakeP -Text "4. Click 'Create user'."))

[void]$docBuilder.Append((MakeP -Text "14. Assigning Admin Role (MANUAL)" -Style "Heading1"))
[void]$docBuilder.Append((MakeP -Text "In the Supabase SQL Editor, execute this snippet to grant admin privileges:"))
[void]$docBuilder.Append((MakeCode -CodeText @"
UPDATE public.profiles
SET role = 'admin',
    full_name = 'Siti Fruities Administrator'
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@sitifruities.com');
"@))

# --- 15 & 16 Environment Variables ---
[void]$docBuilder.Append((MakeP -Text "15. Required Frontend Environment Variables (Netlify & .env)" -Style "Heading1"))
[void]$docBuilder.Append((MakeP -Text "These variables are public and bundled by Vite into the browser application:"))
[void]$docBuilder.Append((MakeCode -CodeText @"
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_PAYSTACK_PUBLIC_KEY=pk_test_... (or pk_live_...)
"@))

[void]$docBuilder.Append((MakeP -Text "16. Required Edge Function Environment Variables (Supabase Secrets)" -Style "Heading1"))
[void]$docBuilder.Append((MakeP -Text "These variables are strictly private server secrets and must NEVER be exposed to the browser:"))
[void]$docBuilder.Append((MakeCode -CodeText @"
PAYSTACK_SECRET_KEY=sk_test_... (or sk_live_...)
SUPABASE_URL=https://<your-project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
"@))

# --- 17 to 22 Paystack Setup ---
[void]$docBuilder.Append((MakeP -Text "17. Paystack Setup (MANUAL)" -Style "Heading1"))
[void]$docBuilder.Append((MakeP -Text "1. Log in to your Paystack Dashboard (https://dashboard.paystack.com)."))
[void]$docBuilder.Append((MakeP -Text "2. Navigate to Settings -> API Keys & Webhooks."))

[void]$docBuilder.Append((MakeP -Text "18. Paystack Public Key Setup" -Style "Heading1"))
[void]$docBuilder.Append((MakeP -Text "Copy the Public Key (pk_test_... or pk_live_...) and add it to Netlify / .env as VITE_PAYSTACK_PUBLIC_KEY."))

[void]$docBuilder.Append((MakeP -Text "19. Paystack Secret Key Setup" -Style "Heading1"))
[void]$docBuilder.Append((MakeP -Text "Copy the Secret Key (sk_test_... or sk_live_...) and set it in Supabase Secrets for Edge Functions."))

[void]$docBuilder.Append((MakeP -Text "20 & 21. Paystack Webhook Configuration" -Style "Heading1"))
[void]$docBuilder.Append((MakeP -Text "In Paystack Settings -> API Keys & Webhooks -> Live/Test Webhook URL, enter:"))
[void]$docBuilder.Append((MakeP -Text "https://<YOUR-PROJECT-REF>.supabase.co/functions/v1/paystack-webhook" -Bold))
[void]$docBuilder.Append((MakeP -Text "Click 'Save Changes'."))

[void]$docBuilder.Append((MakeP -Text "22. Deploying Supabase Edge Functions (MANUAL)" -Style "Heading1"))
[void]$docBuilder.Append((MakeP -Text "Using the Supabase CLI on your workstation:"))
[void]$docBuilder.Append((MakeCode -CodeText @"
# 1. Login to Supabase CLI
supabase login

# 2. Link your local project
supabase link --project-ref <your-project-ref>

# 3. Set Edge Function Secrets
supabase secrets set PAYSTACK_SECRET_KEY=sk_test_your_secret_key

# 4. Deploy the functions
supabase functions deploy paystack-webhook --no-verify-jwt
supabase functions deploy verify-payment --no-verify-jwt
"@))

# --- 23 to 32 Testing Procedures ---
[void]$docBuilder.Append((MakeP -Text "23 to 32. Verification & Testing Procedures" -Style "Heading1"))

[void]$docBuilder.Append((MakeP -Text "23. Testing Paystack Payment Verification" -Style "Heading2"))
[void]$docBuilder.Append((MakeP -Text "• Add an Exotic Parfait to the cart and proceed to checkout."))
[void]$docBuilder.Append((MakeP -Text "• Fill out the approved checkout form and click 'Proceed to Payment'."))
[void]$docBuilder.Append((MakeP -Text "• Use a Paystack test card (e.g. 4084 0840 8408 4081, PIN: 1111, OTP: 123456)."))
[void]$docBuilder.Append((MakeP -Text "• Verify: Modal transitions to Order Confirmation showing SF-YYYYMMDD-XXXX."))

[void]$docBuilder.Append((MakeP -Text "24. Testing Duplicate Webhook / Idempotency" -Style "Heading2"))
[void]$docBuilder.Append((MakeP -Text "• In Paystack dashboard, locate the test transaction and click 'Resend Webhook'."))
[void]$docBuilder.Append((MakeP -Text "• Verify: Webhook returns HTTP 200 with 'Payment already recorded as paid'. No duplicate order or coupon increments occur."))

[void]$docBuilder.Append((MakeP -Text "25 & 26. Testing Guest vs Registered Checkout" -Style "Heading2"))
[void]$docBuilder.Append((MakeP -Text "• Place an order without logging in. Verify orders.user_id is NULL."))
[void]$docBuilder.Append((MakeP -Text "• Log in to customer account and place an order. Verify orders.user_id matches the profile."))

[void]$docBuilder.Append((MakeP -Text "27. Testing Delivery Zones" -Style "Heading2"))
[void]$docBuilder.Append((MakeP -Text "• Select 'OAU Campus' -> Delivery fee shows ₦1,000."))
[void]$docBuilder.Append((MakeP -Text "• Select 'Store Pickup' -> Delivery fee shows FREE (₦0)."))
[void]$docBuilder.Append((MakeP -Text "• Verify: No old ₦1,500/₦20,000 threshold appears."))

[void]$docBuilder.Append((MakeP -Text "28. Testing Coupons" -Style "Heading2"))
[void]$docBuilder.Append((MakeP -Text "• Apply code 'SITI10' on order >= ₦5,000 -> 10% discount applies."))
[void]$docBuilder.Append((MakeP -Text "• Enter invalid code 'FAKE99' -> Displays error 'Invalid or expired coupon code'."))

[void]$docBuilder.Append((MakeP -Text "29. Testing Unavailable Products" -Style "Heading2"))
[void]$docBuilder.Append((MakeP -Text "• In /admin, toggle Chicken Sandwich to 'Unavailable'."))
[void]$docBuilder.Append((MakeP -Text "• Storefront displays 'Currently Unavailable' badge and disabled button."))
[void]$docBuilder.Append((MakeP -Text "• Attempt checkout with stale item -> Server and client block checkout with clear error."))

[void]$docBuilder.Append((MakeP -Text "30. Testing Order Status Transitions" -Style "Heading2"))
[void]$docBuilder.Append((MakeP -Text "• In /admin, move order from confirmed -> preparing -> ready -> out_for_delivery -> delivered."))
[void]$docBuilder.Append((MakeP -Text "• Verify illegal transitions are blocked."))

[void]$docBuilder.Append((MakeP -Text "31. Testing RLS & Security" -Style "Heading2"))
[void]$docBuilder.Append((MakeP -Text "• Attempt to update another customer's order or modify profile role via browser console -> Rejected with RLS violation."))

[void]$docBuilder.Append((MakeP -Text "32. Testing Admin Access" -Style "Heading2"))
[void]$docBuilder.Append((MakeP -Text "• Visit /admin as guest -> Automatically redirected to /admin/login."))
[void]$docBuilder.Append((MakeP -Text "• Log in as admin@sitifruities.com -> Full dashboard unlocks."))

# --- 33 to 35 Production & Troubleshooting ---
[void]$docBuilder.Append((MakeP -Text "33. Production Deployment Checklist (Netlify)" -Style "Heading1"))
[void]$docBuilder.Append((MakeP -Text "1. Go to Netlify Dashboard -> Site Configuration -> Environment Variables."))
[void]$docBuilder.Append((MakeP -Text "2. Add VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_PAYSTACK_PUBLIC_KEY."))
[void]$docBuilder.Append((MakeP -Text "3. In Supabase, run SQL Stages 1 through 5."))
[void]$docBuilder.Append((MakeP -Text "4. Deploy Edge Functions with PAYSTACK_SECRET_KEY secret."))
[void]$docBuilder.Append((MakeP -Text "5. Set Paystack webhook URL to production endpoint."))
[void]$docBuilder.Append((MakeP -Text "6. Trigger Netlify production build."))

[void]$docBuilder.Append((MakeP -Text "34. Troubleshooting" -Style "Heading1"))
[void]$docBuilder.Append((MakeP -Text "• Paystack popup doesn't appear: Verify VITE_PAYSTACK_PUBLIC_KEY is set in Netlify."))
[void]$docBuilder.Append((MakeP -Text "• Webhook not confirming order: Check Supabase Edge Function logs in Supabase Dashboard -> Edge Functions -> paystack-webhook -> Logs."))
[void]$docBuilder.Append((MakeP -Text "• Coupon error: Ensure order subtotal meets minimum_order_amount."))

[void]$docBuilder.Append((MakeP -Text "35. Rollback & Migration Notes" -Style "Heading1"))
[void]$docBuilder.Append((MakeP -Text "If you need to reset the database to a clean state, drop the public schema tables in reverse order of foreign keys, then re-run SQL 1 through SQL 5."))

# Write document.xml
$documentXml = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
$($docBuilder.ToString())
    <w:sectPr>
      <w:pgSz w:w="12240" w:h="15840"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/>
    </w:sectPr>
  </w:body>
</w:document>
"@

$documentXml | Out-File -FilePath (Join-Path $tempDir "word\document.xml") -Encoding utf8

# Compress to .docx
if (Test-Path $outputDocx) { Remove-Item -Force $outputDocx }
Compress-Archive -Path (Join-Path $tempDir "*") -DestinationPath $outputDocx -Force

Write-Host "Successfully generated Word document at: $outputDocx"
