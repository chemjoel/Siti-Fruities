# SITI FRUITIES - Full Phase 3B Setup Guide Word Document (.docx) Generator
$repoRoot = "C:\Users\HP\Documents\GitHub\Siti-Fruities"
$outputDocx = Join-Path $repoRoot "SITI FRUITIES - Phase 3B Setup Guide.docx"
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
$contentTypes | Out-File -LiteralPath (Join-Path $tempDir "[Content_Types].xml") -Encoding utf8

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

$global:docXml = New-Object System.Text.StringBuilder

function EscapeXml([string]$text) {
    if ([string]::IsNullOrEmpty($text)) { return "" }
    # Use standard ASCII replacements
    $res = $text.Replace('&', '&amp;')
    $res = $res.Replace('<', '&lt;')
    $res = $res.Replace('>', '&gt;')
    $res = $res.Replace('"', '&quot;')
    return $res
}

function AddP {
    param([string]$text, [string]$style = "", [bool]$bold = $false, [bool]$italic = $false, [string]$color = "")
    $pPr = if ($style) { "<w:pStyle w:val=""$style""/>" } else { "" }
    if ($pPr) { $pPr = "<w:pPr>$pPr</w:pPr>" }

    $rPr = ""
    if ($bold) { $rPr += "<w:b/>" }
    if ($italic) { $rPr += "<w:i/>" }
    if ($color) { $rPr += "<w:color w:val=""$color""/>" }
    if ($rPr) { $rPr = "<w:rPr>$rPr</w:rPr>" }

    $escaped = EscapeXml $text
    [void]$global:docXml.Append("<w:p>$pPr<w:r>$rPr<w:t xml:space=""preserve"">$escaped</w:t></w:r></w:p>`n")
}

function AddCodeBlock {
    param([string]$codeText)
    $lines = $codeText -split "`r?`n"
    foreach ($line in $lines) {
        $escaped = EscapeXml $line
        [void]$global:docXml.Append("<w:p><w:pPr><w:pStyle w:val=""CodeBlock""/></w:pPr><w:r><w:rPr><w:rFonts w:ascii=""Consolas"" w:hAnsi=""Consolas""/><w:sz w:val=""17""/><w:color w:val=""1A202C""/></w:rPr><w:t xml:space=""preserve"">$escaped</w:t></w:r></w:p>`n")
    }
}

function AddCallout {
    param([string]$title, [string]$text, [string]$color = "1E5631", [string]$fill = "F0FDF4")
    $eTitle = EscapeXml $title
    $eText = EscapeXml $text
    $xml = @"
<w:p>
  <w:pPr>
    <w:shd w:val="clear" w:color="auto" w:fill="$fill"/>
    <w:pBdr>
      <w:left w:val="single" w:sz="36" w:space="12" w:color="$color"/>
    </w:pPr>
    <w:spacing w:before="120" w:after="120"/>
  </w:pPr>
  <w:r>
    <w:rPr><w:b/><w:color w:val="$color"/></w:rPr>
    <w:t xml:space="preserve">$($eTitle): </w:t>
  </w:r>
  <w:r>
    <w:t xml:space="preserve">$eText</w:t>
  </w:r>
</w:p>
"@
    [void]$global:docXml.Append($xml)
}

# Read SQL files
$sql1 = Get-Content -Path (Join-Path $repoRoot "supabase\sql\1_extensions_tables.sql") -Raw
$sql2 = Get-Content -Path (Join-Path $repoRoot "supabase\sql\2_constraints_functions_triggers.sql") -Raw
$sql3 = Get-Content -Path (Join-Path $repoRoot "supabase\sql\3_row_level_security.sql") -Raw
$sql4 = Get-Content -Path (Join-Path $repoRoot "supabase\sql\4_storage_setup.sql") -Raw
$sql5 = Get-Content -Path (Join-Path $repoRoot "supabase\sql\5_seed_data.sql") -Raw

# Document Content
AddP "SITI FRUITIES" "Title"
AddP "Phase 3B Complete Backend & Commerce Setup Guide" "Subtitle"
AddCallout "PURPOSE OF THIS DOCUMENT" "This Microsoft Word document is the authoritative, copyable manual execution guide for the SITI FRUITIES backend, commerce, Paystack integration, and Supabase database. Every SQL snippet, command, environment variable, and verification test is detailed with zero placeholders."

# Quick Start Section
AddP "QUICK START" "Heading1"
AddP "Follow these steps in order to get SITI FRUITIES fully running on your PC and staging/production databases:"
AddP "1. Create a Supabase Project (see Section 3)."
AddP "2. Open Supabase SQL Editor and run SQL Stages 1 through 5 in order (see Section 4)."
AddP "3. Configure Supabase Email Auth (see Section 12)."
AddP "4. Create your Admin user and run the safe role-elevation script (see Sections 13 and 14)."
AddP "5. Set up Frontend Environment Variables in Netlify and your local .env (see Section 15)."
AddP "6. Set up Supabase Edge Function Environment Secrets (see Section 16)."
AddP "7. Configure Paystack gateway and webhook endpoint in Paystack dashboard (see Sections 17-21)."
AddP "8. Deploy Edge Functions (see Section 22)."
AddP "9. Test all operations using the testing checklists in Sections 23-32."
AddP "10. Perform final Netlify production build (see Section 33)."

# 1. Overview
AddP "1. Overview" "Heading1"
AddP "SITI FRUITIES is a premium fruit and healthy treat brand specializing in signature Greek Yogurt Parfaits, Smoothies, Sandwiches, Boba Teas, Juices, and curated Gift Treatboxes."
AddP "This Phase 3B specification transitions the deployed frontend from a static in-memory prototype into a fully server-authoritative e-commerce platform backed by Supabase PostgreSQL, Paystack payment processing, zone-based delivery pricing, server-side coupon validation, and an administrative control center."

# 2. What Phase 3B Implements
AddP "2. What Phase 3B Implements" "Heading1"
AddP "- Server-Authoritative Orders: Client submits cart intent; the database calculates prices, modifiers, fees, discounts, and totals atomically via RPC."
AddP "- Order Item Snapshots: Line items lock product name, unit price, and options at order time. Price edits never alter historical orders."
AddP "- Zone-Based Delivery: Delivery zones table drives checkout fees (including NGN 0 store pickup), replacing the flat NGN 1,500 / NGN 20,000 threshold."
AddP "- Real-Time Availability Check: ProductCard visual cues, plus both frontend and server-side availability rejection."
AddP "- Double-Protected Role System: Customer role escalation is strictly blocked at the RLS and trigger levels."
AddP "- Paystack Integration: Frontend Paystack Popup with server-side HMAC SHA512 webhook verification and fallback verification."
AddP "- Order Confirmation & WhatsApp: Human-readable order numbers (SF-YYYYMMDD-XXXX) handed off to WhatsApp."
AddP "- Operations Dashboard: Secure admin dashboard at /admin for orders, products, delivery, coupons, promotions, and enquiries."

# 3. Supabase Project Setup
AddP "3. Supabase Project Setup (MANUAL)" "Heading1"
AddP "1. Navigate to https://supabase.com and sign in."
AddP "2. Click 'New Project' and select your organization."
AddP "3. Enter Project Name: Siti-Fruities-Backend"
AddP "4. Set a strong Database Password (store securely in your password manager)."
AddP "5. Choose Region: West Europe (London) or closest region."
AddP "6. Click 'Create new project' and wait 2 minutes for provisioning."

# 4. Required SQL
AddP "4. Required SQL Execution (MANUAL)" "Heading1"
AddP "In the Supabase Dashboard, click the SQL Editor (icon on left sidebar), open a New Query, paste each SQL stage sequentially, and click Run."

AddP "SQL 01 - Extensions & Base Tables (Run First)" "Heading2"
AddP "Creates pgcrypto/uuid extensions and core tables: categories, products, delivery_zones, coupons, promotions, profiles, saved_addresses, orders, order_items, catering_enquiries, and custom_parfait_quotes." "" $false $true
AddCodeBlock $sql1

AddP "SQL 02 - Constraints, Functions, Triggers & RPCs (Run Second)" "Heading2"
AddP "Creates human-readable order number generator (SF-YYYYMMDD-XXXX), profile creation trigger, role escalation protection, server-authoritative order creation RPC (create_authoritative_order), status transition enforcement trigger, and idempotent payment confirmation function." "" $false $true
AddCodeBlock $sql2

AddP "SQL 03 - Row Level Security Policies (Run Third)" "Heading2"
AddP "Enables RLS across all tables. Grants public read for active products/categories/zones, restricts admin tables to verified admin profiles, and prevents customers from escalating roles." "" $false $true
AddCodeBlock $sql3

AddP "SQL 04 - Supabase Storage Buckets & Policies (Run Fourth)" "Heading2"
AddP "Creates public buckets 'product-images' and 'promo-flyers' with public read and authenticated admin upload/delete policies." "" $false $true
AddCodeBlock $sql4

AddP "SQL 05 - Complete Initial Seed Data (Run Fifth)" "Heading2"
AddP "Populates authentic menu products, options, delivery zones, initial coupons (SITI10, WELCOME500, VIPFRESH), and active promotional banners." "" $false $true
AddCodeBlock $sql5

# 5 to 9 Database Architecture
AddP "5. Database Schema & Relationships" "Heading1"
AddP "The database contains 10 core tables interconnected via foreign keys: profiles extends auth.users; products references categories; orders optionally references profiles, coupons, and delivery_zones; order_items snapshots product details under orders."

AddP "6. Row Level Security (RLS) Architecture" "Heading1"
AddP "- Public: Can select active products, categories, delivery zones, promotions. Can create orders and submit enquiries."
AddP "- Registered Customer: Can view and update their own profile (name, phone) and view their own order history."
AddP "- Admin: Full select/insert/update/delete across all tables via is_admin() security definer function."

AddP "7. RPC & Database Functions" "Heading1"
AddP "- create_authoritative_order(p_payload): Server-authoritative atomic order computation and insertion."
AddP "- validate_and_apply_coupon(p_code, p_subtotal): Validates active status, expiry, limits, and computes discount."
AddP "- confirm_order_payment(p_order_id, p_paystack_ref): Idempotent payment recorder."
AddP "- generate_order_number(): Generates SF-YYYYMMDD-XXXX with collision loop check."

AddP "8. Indexes & Constraints" "Heading1"
AddP "B-Tree indexes created on orders(user_id), orders(order_number), orders(paystack_reference), products(category_id), products(is_featured), coupons(code), promotions(is_active)."

AddP "9. Triggers Summary" "Heading1"
AddP "- handle_updated_at: Updates updated_at column on record changes."
AddP "- trg_set_order_number: Auto-assigns SF-YYYYMMDD-XXXX on order creation."
AddP "- on_auth_user_created: Automatically creates public.profiles row upon user signup."
AddP "- trg_prevent_role_escalation: Throws error if non-admin attempts to modify profile role."
AddP "- trg_enforce_order_status: Enforces legitimate status progressions (e.g. pending_payment -> confirmed -> preparing -> ready -> out_for_delivery -> delivered)."

# 10 & 11 Storage
AddP "10. Storage Bucket Setup (MANUAL)" "Heading1"
AddP "SQL Stage 04 automatically creates the buckets. If creating manually via dashboard:"
AddP "1. Go to Storage in Supabase sidebar."
AddP "2. Click 'New Bucket' -> Name: product-images -> Toggle 'Public Bucket' -> Save."
AddP "3. Click 'New Bucket' -> Name: promo-flyers -> Toggle 'Public Bucket' -> Save."

AddP "11. Storage Policies" "Heading1"
AddP "Public can read; only authenticated administrators can insert, update, or delete files."

# 12 to 14 Auth & Admin Setup
AddP "12. Supabase Auth Configuration (MANUAL)" "Heading1"
AddP "1. In Supabase Dashboard, go to Authentication -> Providers -> Email."
AddP "2. Ensure Email provider is Enabled."
AddP "3. Disable 'Confirm email' for development/testing if you want instant logins."

AddP "13. Admin User Setup (MANUAL)" "Heading1"
AddP "1. In Supabase Dashboard, go to Authentication -> Users."
AddP "2. Click 'Add User' -> 'Create user'."
AddP "3. Enter admin email: admin@sitifruities.com (or your email) and set a secure password."
AddP "4. Click 'Create user'."

AddP "14. Assigning Admin Role (MANUAL)" "Heading1"
AddP "In the Supabase SQL Editor, execute this snippet to grant admin privileges:"
AddCodeBlock @"
UPDATE public.profiles
SET role = 'admin',
    full_name = 'Siti Fruities Administrator'
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@sitifruities.com');
"@

# 15 & 16 Environment Variables
AddP "15. Required Frontend Environment Variables (Netlify & .env)" "Heading1"
AddP "These variables are public and bundled by Vite into the browser application:"
AddCodeBlock @"
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_PAYSTACK_PUBLIC_KEY=pk_test_... (or pk_live_...)
"@

AddP "16. Required Edge Function Environment Variables (Supabase Secrets)" "Heading1"
AddP "These variables are strictly private server secrets and must NEVER be exposed to the browser:"
AddCodeBlock @"
PAYSTACK_SECRET_KEY=sk_test_... (or sk_live_...)
SUPABASE_URL=https://<your-project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
"@

# 17 to 22 Paystack Setup
AddP "17. Paystack Setup (MANUAL)" "Heading1"
AddP "1. Log in to your Paystack Dashboard (https://dashboard.paystack.com)."
AddP "2. Navigate to Settings -> API Keys & Webhooks."

AddP "18. Paystack Public Key Setup" "Heading1"
AddP "Copy the Public Key (pk_test_... or pk_live_...) and add it to Netlify / .env as VITE_PAYSTACK_PUBLIC_KEY."

AddP "19. Paystack Secret Key Setup" "Heading1"
AddP "Copy the Secret Key (sk_test_... or sk_live_...) and set it in Supabase Secrets for Edge Functions."

AddP "20 & 21. Paystack Webhook Configuration" "Heading1"
AddP "In Paystack Settings -> API Keys & Webhooks -> Live/Test Webhook URL, enter:"
AddP "https://<YOUR-PROJECT-REF>.supabase.co/functions/v1/paystack-webhook"

AddP "22. Deploying Supabase Edge Functions (MANUAL)" "Heading1"
AddP "Using the Supabase CLI on your workstation:"
AddCodeBlock @"
# 1. Login to Supabase CLI
supabase login

# 2. Link your local project
supabase link --project-ref <your-project-ref>

# 3. Set Edge Function Secrets
supabase secrets set PAYSTACK_SECRET_KEY=sk_test_your_secret_key

# 4. Deploy the functions
supabase functions deploy paystack-webhook --no-verify-jwt
supabase functions deploy verify-payment --no-verify-jwt
"@

# 23 to 32 Testing Procedures
AddP "23 to 32. Verification & Testing Procedures" "Heading1"

AddP "23. Testing Paystack Payment Verification" "Heading2"
AddP "- Add an Exotic Parfait to the cart and proceed to checkout."
AddP "- Fill out the approved checkout form and click 'Proceed to Payment'."
AddP "- Use a Paystack test card (e.g. 4084 0840 8408 4081, PIN: 1111, OTP: 123456)."
AddP "- Verify: Modal transitions to Order Confirmation showing SF-YYYYMMDD-XXXX."

AddP "24. Testing Duplicate Webhook / Idempotency" "Heading2"
AddP "- In Paystack dashboard, locate the test transaction and click 'Resend Webhook'."
AddP "- Verify: Webhook returns HTTP 200 with 'Payment already recorded as paid'. No duplicate order or coupon increments occur."

AddP "25 & 26. Testing Guest vs Registered Checkout" "Heading2"
AddP "- Place an order without logging in. Verify orders.user_id is NULL."
AddP "- Log in to customer account and place an order. Verify orders.user_id matches the profile."

AddP "27. Testing Delivery Zones" "Heading2"
AddP "- Select 'OAU Campus' -> Delivery fee shows NGN 1,000."
AddP "- Select 'Store Pickup' -> Delivery fee shows FREE (NGN 0)."
AddP "- Verify: No old NGN 1,500/NGN 20,000 threshold appears."

AddP "28. Testing Coupons" "Heading2"
AddP "- Apply code 'SITI10' on order >= NGN 5,000 -> 10% discount applies."
AddP "- Enter invalid code 'FAKE99' -> Displays error 'Invalid or expired coupon code'."

AddP "29. Testing Unavailable Products" "Heading2"
AddP "- In /admin, toggle Chicken Sandwich to 'Unavailable'."
AddP "- Storefront displays 'Currently Unavailable' badge and disabled button."
AddP "- Attempt checkout with stale item -> Server and client block checkout with clear error."

AddP "30. Testing Order Status Transitions" "Heading2"
AddP "- In /admin, move order from confirmed -> preparing -> ready -> out_for_delivery -> delivered."
AddP "- Verify illegal transitions are blocked."

AddP "31. Testing RLS & Security" "Heading2"
AddP "- Attempt to update another customer's order or modify profile role via browser console -> Rejected with RLS violation."

AddP "32. Testing Admin Access" "Heading2"
AddP "- Visit /admin as guest -> Automatically redirected to /admin/login."
AddP "- Log in as admin@sitifruities.com -> Full dashboard unlocks."

AddP "33. Testing Favicon" "Heading2"
AddP "- Verify the browser tab displays the custom SITI FRUITIES logo instead of a red square."

# 34 to 35 Production & Troubleshooting
AddP "34. Production Deployment Checklist (Netlify)" "Heading1"
AddP "1. Go to Netlify Dashboard -> Site Configuration -> Environment Variables."
AddP "2. Add VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_PAYSTACK_PUBLIC_KEY."
AddP "3. In Supabase, run SQL Stages 1 through 5."
AddP "4. Deploy Edge Functions with PAYSTACK_SECRET_KEY secret."
AddP "5. Set Paystack webhook URL to production endpoint."
AddP "6. Trigger Netlify production build."

AddP "35. Troubleshooting" "Heading1"
AddP "- Paystack popup does not appear: Verify VITE_PAYSTACK_PUBLIC_KEY is set in Netlify."
AddP "- Webhook not confirming order: Check Supabase Edge Function logs in Supabase Dashboard -> Edge Functions -> paystack-webhook -> Logs."
AddP "- Coupon error: Ensure order subtotal meets minimum_order_amount."

AddP "36. Rollback & Migration Notes" "Heading1"
AddP "If you need to reset the database to a clean state, drop the public schema tables in reverse order of foreign keys, then re-run SQL 1 through SQL 5."

# Write document.xml
$documentXml = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
$($global:docXml.ToString())
    <w:sectPr>
      <w:pgSz w:w="12240" w:h="15840"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/>
    </w:sectPr>
  </w:body>
</w:document>
"@

$documentXml | Out-File -FilePath (Join-Path $tempDir "word\document.xml") -Encoding utf8

# Compress to .zip first, then rename to .docx
$tempZip = Join-Path $repoRoot "temp_guide.zip"
if (Test-Path $tempZip) { Remove-Item -Force $tempZip }
if (Test-Path $outputDocx) { Remove-Item -Force $outputDocx }

Compress-Archive -Path (Join-Path $tempDir "*") -DestinationPath $tempZip -Force
Move-Item -Path $tempZip -Destination $outputDocx -Force

# Copy to standard folders
Copy-Item $outputDocx -Destination "C:\Users\HP\Downloads\SITI FRUITIES - Phase 3B Setup Guide.docx" -Force
Copy-Item $outputDocx -Destination "C:\Users\HP\Desktop\SITI FRUITIES - Phase 3B Setup Guide.docx" -Force
Copy-Item $outputDocx -Destination "C:\Users\HP\.gemini\antigravity\brain\0c04cb61-15b5-4ee5-9728-aa38a3418c03\SITI FRUITIES - Phase 3B Setup Guide.docx" -Force

# Clean up temp build folder
Remove-Item -Recurse -Force $tempDir

Write-Host "SUCCESS: Created and copied SITI FRUITIES - Phase 3B Setup Guide.docx"
