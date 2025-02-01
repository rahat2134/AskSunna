import json

# Load Quran data
with open("quran.json", "r") as f:
    quran_data = json.load(f)

# Load temporary Hadith data
with open("hadiths.json", "r") as f:
    hadith_data = json.load(f)

# Combine datasets
combined_data = quran_data + hadith_data

# Save to a new file
with open("islamic_data.json", "w") as f:
    json.dump(combined_data, f, indent=2, ensure_ascii=False)

print("Combined data saved to islamic_data.json!")