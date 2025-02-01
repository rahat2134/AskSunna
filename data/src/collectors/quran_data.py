import requests
import json

quran_data = []

for surah_id in range(1, 115):
    try:
        # Updated API parameters to include translations
        response = requests.get(
            f"https://api.quran.com/api/v4/verses/by_chapter/{surah_id}",
            params={
                "language": "en",
                "fields": "text_uthmani,translations",
                "translations": "131"  # Sahih International translation ID
            }
        )
        
        if response.status_code == 200:
            verses = response.json().get("verses", [])
            for verse in verses:
                # Extract Arabic text
                arabic_text = verse.get("text_uthmani", "Text unavailable")
                
                # Extract English translation
                translations = verse.get("translations", [])
                english_translation = "Translation not available"
                if translations:
                    english_translation = translations[0].get("text", "Translation not available")
                
                quran_data.append({
                    "text": arabic_text,
                    "translation": english_translation,
                    "source": f"Quran {surah_id}:{verse.get('verse_number', 'N/A')}",
                    "tags": [],
                    "sect": "all"
                })
        else:
            print(f"❌ Failed to fetch Surah {surah_id}: HTTP {response.status_code}")
    
    except Exception as e:
        print(f"❌ Error processing Surah {surah_id}: {str(e)}")

# Save to JSON file
with open("quran.json", "w", encoding="utf-8") as f:
    json.dump(quran_data, f, ensure_ascii=False, indent=2)

print("✅ Quran data saved to quran.json!")