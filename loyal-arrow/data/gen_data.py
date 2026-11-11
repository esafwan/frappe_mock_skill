#!/usr/bin/env python3 -I
"""Deterministic SYNTHETIC data for Loyal Arrow mock videos. No real people, phones or IDs.
Phones use the app's undialable reserved pattern +0000000NNNN (display masked as +0000000****NN).
Run: python3 -I gen_data.py   (writes uae-dubai-supermarket/ and india-departmental-store/)."""
import json, os, random
HERE = os.path.dirname(os.path.abspath(__file__))

SETS = {
 "uae-dubai-supermarket": dict(
  store="Al Noor Fresh Market", store_ar="سوق النور الطازج", city="Dubai", currency="AED", locale="en-AE",
  tax=dict(name="VAT", rate=0.05), earn_per_unit=1, unit_label="AED", min_redeem=100, redeem_value=0.10,
  tiers=[("Silver",0,1.0),("Gold",1500,1.25),("Platinum",5000,1.5)],
  first=[("Omar","عمر"),("Fatima","فاطمة"),("Khalid","خالد"),("Aisha","عائشة"),("Yusuf","يوسف"),("Maryam","مريم"),("Hassan","حسن"),("Layla","ليلى"),("Rashid","راشد"),("Noor","نور"),("Sara","سارة"),("Ahmed","أحمد"),("Priya","بريا"),("Ravi","رافي"),("Joseph","جوزيف"),("Maria","ماريا")],
  last=[("Al Mansoori","المنصوري"),("Al Hashimi","الهاشمي"),("Khan","خان"),("Nair","ناير"),("D'Souza","دي سوزا"),("Al Falasi","الفلاسي"),("Hussain","حسين"),("Thomas","توماس")],
  skus=[("Fresh Milk 1L","حليب طازج 1 لتر",6.5,"Dairy"),("Labneh 500g","لبنة 500 غ",11.0,"Dairy"),("Arabic Bread 6pc","خبز عربي 6 قطع",4.0,"Bakery"),("Basmati Rice 5kg","أرز بسمتي 5 كغ",38.0,"Pantry"),("Dates Khalas 1kg","تمر خلاص 1 كغ",32.0,"Pantry"),("Olive Oil 1L","زيت زيتون 1 لتر",29.0,"Pantry"),("Chicken Breast 1kg","صدر دجاج 1 كغ",24.0,"Meat"),("Lamb Mince 500g","لحم غنم مفروم 500 غ",35.0,"Meat"),("Hammour Fillet 500g","فيليه هامور 500 غ",42.0,"Fish"),("Tomatoes 1kg","طماطم 1 كغ",5.5,"Produce"),("Cucumber 1kg","خيار 1 كغ",4.5,"Produce"),("Bananas 1kg","موز 1 كغ",6.0,"Produce"),("Mangoes 1kg","مانجو 1 كغ",14.0,"Produce"),("Eggs 30pc","بيض 30 حبة",15.0,"Dairy"),("Cheddar 400g","جبنة شيدر 400 غ",18.5,"Dairy"),("Karak Tea 20 bags","شاي كرك 20 كيس",9.0,"Beverages"),("Arabic Coffee 250g","قهوة عربية 250 غ",22.0,"Beverages"),("Mineral Water 12x500ml","مياه معدنية 12 × 500 مل",8.0,"Beverages"),("Orange Juice 1L","عصير برتقال 1 لتر",7.5,"Beverages"),("Zaatar 200g","زعتر 200 غ",9.5,"Pantry"),("Tahini 400g","طحينة 400 غ",14.0,"Pantry"),("Chickpeas 400g","حمص 400 غ",3.5,"Pantry"),("Sugar 2kg","سكر 2 كغ",8.5,"Pantry"),("Flour 2kg","طحين 2 كغ",7.0,"Pantry"),("Dishwash Liquid 750ml","سائل غسيل الأطباق 750 مل",12.0,"Household"),("Laundry Detergent 3kg","منظف غسيل 3 كغ",36.0,"Household"),("Tissue Box 5pc","مناديل 5 علب",16.0,"Household"),("Toothpaste 120g","معجون أسنان 120 غ",10.5,"Personal care"),("Shampoo 400ml","شامبو 400 مل",19.0,"Personal care"),("Hand Soap 500ml","صابون سائل 500 مل",9.0,"Personal care"),("Frozen Peas 900g","بازلاء مجمدة 900 غ",8.0,"Frozen"),("Ice Cream 1L","آيس كريم 1 لتر",17.0,"Frozen"),("Samosa Frozen 24pc","سمبوسة مجمدة 24 قطعة",21.0,"Frozen"),("Pasta 500g","معكرونة 500 غ",4.5,"Pantry"),("Tuna Can 185g","تونة معلبة 185 غ",7.0,"Pantry"),("Cornflakes 500g","كورن فليكس 500 غ",15.0,"Pantry"),("Chocolate Bar 100g","شوكولاتة 100 غ",6.0,"Snacks"),("Potato Chips 150g","رقائق بطاطس 150 غ",5.0,"Snacks"),("Pistachios 250g","فستق 250 غ",28.0,"Snacks"),("Onions 2kg","بصل 2 كغ",6.5,"Produce")],
  wa_lang="en"),
 "india-departmental-store": dict(
  store="Sree Lakshmi Departmental Store", store_ar=None, city="Kochi", currency="INR", locale="en-IN",
  tax=dict(name="GST", rate=0.05), earn_per_unit=100, unit_label="Rs 100", min_redeem=100, redeem_value=0.25,
  tiers=[("Silver",0,1.0),("Gold",5000,1.25),("Platinum",20000,1.5)],
  first=[("Anil","अनिल","അനിൽ"),("Sunita","सुनीता","സുനിത"),("Rajesh","राजेश","രാജേഷ്"),("Meera","मीरा","മീര"),("Vikram","विक्रम","വിക്രം"),("Lakshmi","लक्ष्मी","ലക്ഷ്മി"),("Suresh","सुरेश","സുരേഷ്"),("Divya","दिव्या","ദിവ്യ"),("Arjun","अर्जुन","അർജുൻ"),("Anjali","अंजलि","അഞ്ജലി"),("Biju","बीजू","ബിജു"),("Rekha","रेखा","രേഖ")],
  last=[("Nair","नायर","നായർ"),("Menon","मेनन","മേനോൻ"),("Pillai","पिल्लै","പിള്ള"),("Sharma","शर्मा","ശർമ്മ"),("Iyer","अय्यर","അയ്യർ"),("Kurian","कुरियन","കുര്യൻ"),("Singh","सिंह","സിംഗ്")],
  skus=[("Matta Rice 5kg","मट्टा चावल 5 किग्रा","മട്ട അരി 5 കിലോ",340,"Staples"),("Toor Dal 1kg","तूर दाल 1 किग्रा","തുവര പരിപ്പ് 1 കിലോ",165,"Staples"),("Coconut Oil 1L","नारियल तेल 1 ली","വെളിച്ചെണ്ണ 1 ലിറ്റർ",260,"Staples"),("Sugar 1kg","चीनी 1 किग्रा","പഞ്ചസാര 1 കിലോ",48,"Staples"),("Atta 5kg","आटा 5 किग्रा","ആട്ട 5 കിലോ",235,"Staples"),("Tea Powder 500g","चाय पत्ती 500 ग्राम","ചായപ്പൊടി 500 ഗ്രാം",210,"Beverages"),("Filter Coffee 250g","फिल्टर कॉफी 250 ग्राम","ഫിൽട്ടർ കാപ്പി 250 ഗ്രാം",190,"Beverages"),("Milk 1L","दूध 1 ली","പാൽ 1 ലിറ്റർ",58,"Dairy"),("Curd 500g","दही 500 ग्राम","തൈര് 500 ഗ്രാം",40,"Dairy"),("Ghee 500ml","घी 500 मिली","നെയ്യ് 500 മില്ലി",320,"Dairy"),("Paneer 200g","पनीर 200 ग्राम","പനീർ 200 ഗ്രാം",95,"Dairy"),("Eggs 12pc","अंडे 12","മുട്ട 12",84,"Dairy"),("Turmeric Powder 200g","हल्दी 200 ग्राम","മഞ്ഞൾപ്പൊടി 200 ഗ്രാം",70,"Spices"),("Chilli Powder 200g","मिर्च पाउडर 200 ग्राम","മുളകുപൊടി 200 ഗ്രാം",85,"Spices"),("Coriander Powder 200g","धनिया पाउडर 200 ग्राम","മല്ലിപ്പൊടി 200 ഗ്രാം",60,"Spices"),("Mustard Seeds 100g","सरसों 100 ग्राम","കടുക് 100 ഗ്രാം",30,"Spices"),("Banana Nendran 1kg","केला नेंद्रन 1 किग्रा","നേന്ത്രപ്പഴം 1 കിലോ",70,"Produce"),("Tomato 1kg","टमाटर 1 किग्रा","തക്കാളി 1 കിലോ",40,"Produce"),("Onion 1kg","प्याज 1 किग्रा","സവാള 1 കിലോ",35,"Produce"),("Coconut 1pc","नारियल 1","തേങ്ങ 1",38,"Produce"),("Curry Leaves 100g","करी पत्ता 100 ग्राम","കറിവേപ്പില 100 ഗ്രാം",15,"Produce"),("Biscuit Pack","बिस्कुट पैक","ബിസ്കറ്റ് പായ്ക്ക്",30,"Snacks"),("Banana Chips 200g","केला चिप्स 200 ग्राम","ഏത്തയ്ക്കാ ഉപ്പേരി 200 ഗ്രാം",90,"Snacks"),("Murukku 250g","मुरुक्कु 250 ग्राम","മുറുക്ക് 250 ഗ്രാം",100,"Snacks"),("Noodles 5pk","नूडल्स 5 पैक","നൂഡിൽസ് 5 പാക്ക്",75,"Snacks"),("Dishwash Bar","बर्तन साबुन","പാത്രം കഴുകുന്ന സോപ്പ്",25,"Household"),("Detergent 1kg","डिटर्जेंट 1 किग्रा","ഡിറ്റർജന്റ് 1 കിലോ",125,"Household"),("Floor Cleaner 1L","फर्श क्लीनर 1 ली","ഫ്ലോർ ക്ലീനർ 1 ലിറ്റർ",160,"Household"),("Bath Soap 4pk","नहाने का साबुन 4","കുളി സോപ്പ് 4",150,"Personal care"),("Shampoo 340ml","शैम्पू 340 मिली","ഷാംപൂ 340 മില്ലി",210,"Personal care"),("Toothpaste 150g","टूथपेस्ट 150 ग्राम","ടൂത്ത്പേസ്റ്റ് 150 ഗ്രാം",95,"Personal care"),("Idli Batter 1kg","इडली बैटर 1 किग्रा","ഇഡ്ഡലി മാവ് 1 കിലോ",60,"Fresh"),("Appam Mix 500g","अप्पम मिक्स 500 ग्राम","അപ്പം പൊടി 500 ഗ്രാം",85,"Staples"),("Pickle Mango 400g","आम का अचार 400 ग्राम","മാങ്ങ അച്ചാർ 400 ഗ്രാം",110,"Pantry"),("Papad 200g","पापड़ 200 ग्राम","പപ്പടം 200 ഗ്രാം",55,"Pantry"),("Jaggery 500g","गुड़ 500 ग्राम","ശർക്കര 500 ഗ്രാം",65,"Pantry"),("Honey 250g","शहद 250 ग्राम","തേൻ 250 ഗ്രാം",140,"Pantry"),("Cashew 250g","काजू 250 ग्राम","കശുവണ്ടി 250 ഗ്രാം",320,"Dry fruits"),("Dates 500g","खजूर 500 ग्राम","ഈന്തപ്പഴം 500 ഗ്രാം",210,"Dry fruits"),("Soft Drink 750ml","सॉफ्ट ड्रिंक 750 मिली","സോഫ്റ്റ് ഡ്രിങ്ക് 750 മില്ലി",45,"Beverages")],
  wa_lang="en"),
}

def phone(i): return f"+0000000{i:04d}"
def mask(p): return "+0000000****" + p[-2:]

def build(key, cfg):
    rnd = random.Random(42 if key.startswith("uae") else 43)
    multi = key.startswith("india")
    tiers = [dict(tier_name=n, threshold_pts=t, earn_multiplier=m) for n, t, m in cfg["tiers"]]
    skus = []
    for i, s in enumerate(cfg["skus"]):
        if multi: en, hi, ml, price, cat = s; names = dict(en=en, hi=hi, ml=ml)
        else: en, ar, price, cat = s; names = dict(en=en, ar=ar)
        skus.append(dict(sku=f"SKU{i+1:03d}", names=names, price=price, category=cat))
    assert len(skus) == 40, (key, len(skus))
    members = []
    for i in range(60):
        f = rnd.choice(cfg["first"]); l = rnd.choice(cfg["last"])
        names = {"en": f"{f[0]} {l[0]}"}
        if multi: names.update(hi=f"{f[1]} {l[1]}", ml=f"{f[2]} {l[2]}")
        else: names["ar"] = f"{f[1]} {l[1]}"
        tier = "Platinum" if i < 6 else "Gold" if i < 22 else "Silver"
        members.append(dict(member_id=f"LA-M{i+1:03d}", names=names, mobile=phone(i+1), mobile_masked=mask(phone(i+1)),
            is_synthetic=1, tier=tier, preferred_language=("en" if i % 3 else ("hi" if multi else "ar")),
            consent_service=1, consent_marketing=int(i % 4 != 0), referral_code=f"REF{rnd.randrange(10**5):05d}",
            balance_pts=0, lifetime_pts=0))
    mult = {t["tier_name"]: t["earn_multiplier"] for t in tiers}
    bills = []
    for b in range(200):
        m = members[rnd.randrange(60) if rnd.random() > .3 else rnd.randrange(22)]
        lines = []
        for _ in range(rnd.randint(2, 9)):
            s = rnd.choice(skus); q = rnd.randint(1, 3)
            lines.append(dict(sku=s["sku"], qty=q, amount=round(s["price"] * q, 2)))
        net = round(sum(x["amount"] for x in lines), 2)
        tax = round(net * cfg["tax"]["rate"], 2); total = round(net + tax, 2)
        pts = int(net // cfg["earn_per_unit"] * mult[m["tier"]]) if not multi else int(net // 100 * 10 * mult[m["tier"]])
        m["balance_pts"] += pts; m["lifetime_pts"] += pts
        bills.append(dict(bill_no=f"B{20261100+b+1}", member_id=m["member_id"], lines=lines, net=net,
            tax_name=cfg["tax"]["name"], tax=tax, total=total, currency=cfg["currency"], points_earned=pts,
            day_offset=-(199 - b) // 3))
    referrals = [dict(referrer=f"LA-M{i+1:03d}", referee=f"LA-M{i+31:03d}", status=("Rewarded" if i % 3 == 0 else "Qualified" if i % 3 == 1 else "Pending")) for i in range(10)]
    return dict(cfg=dict(store=cfg["store"], store_ar=cfg["store_ar"], city=cfg["city"], currency=cfg["currency"], locale=cfg["locale"],
        tax=cfg["tax"], earn_rule=("1 pt per %s net, tier multiplier" % cfg["unit_label"]) if not multi else "10 pts per Rs 100 net, tier multiplier",
        min_redeem_pts=cfg["min_redeem"], redeem_value_per_pt=cfg["redeem_value"], synthetic=True),
        tiers=tiers, skus=skus, members=members, bills=bills, referrals=referrals)

def wa(key, d):
    cfg = d["cfg"]; biz = cfg["store"]; m = d["members"][4]; b = d["bills"][0]
    first = m["names"]["en"].split()[0]
    return [
     dict(template="loyal_arrow_enrolment_confirmation", to=m["mobile_masked"], text=f"Welcome to {biz}, {first}. Your membership is now active and your starting balance is 0 points. Reply or tap below any time to check your balance.", buttons=["Check balance"]),
     dict(template="loyal_arrow_points_earned", to=m["mobile_masked"], text=f"Hi {first}, you earned {b['points_earned']} points with {biz} for your {cfg['currency']} {b['total']:.2f} bill. Your new balance is {b['points_earned']+120} points.", buttons=["Check balance"]),
     dict(template="loyal_arrow_tier_changed", to=m["mobile_masked"], text=f"Hi {first}, your {biz} tier is now Gold.", buttons=["Check balance"], note="wording illustrative; take exact body from ../../copy/whatsapp_templates.json"),
    ]

for key, cfg in SETS.items():
    d = build(key, cfg); out = os.path.join(HERE, key); os.makedirs(out, exist_ok=True)
    for name in ("cfg","tiers","skus","members","bills","referrals"):
        json.dump(d[name], open(os.path.join(out, name + ".json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    json.dump(wa(key, d), open(os.path.join(out, "whatsapp_previews.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(key, len(d["skus"]), len(d["members"]), len(d["bills"]))
