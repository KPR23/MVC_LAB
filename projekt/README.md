# 🎟️ System rezerwacji biletów na wydarzenia

## 📋 Spis treści

- [Opis projektu](#opis-projektu)
- [Funkcjonalności](#funkcjonalności)
- [Instrukcja uruchomienia](#instrukcja-uruchomienia)
- [Technologie](#technologie)

## 📝 Opis projektu

Aplikacja do rezerwacji biletów na wydarzenia umożliwiająca użytkownikom przeglądanie i zakup biletów na różne wydarzenia. System został zaimplementowany zgodnie z architekturą MVC (Model-View-Controller).

## ✨ Funkcjonalności

- **Przeglądanie wydarzeń** - użytkownicy mogą przeglądać dostępne wydarzenia
- **Zakup biletów** - możliwość zakupu biletów na wybrane wydarzenie
- **Szczegóły wydarzenia** - wyświetlanie szczegółowych informacji o wybranym wydarzeniu, w tym zdjęć, opisu, daty, lokalizacji, artystów występujących oraz ceny i pozostałych wolnych miejsc
- **Zarządzanie wydarzeniami** - dodawanie, edycja i usuwanie wydarzeń

## 🛠️ Instrukcja uruchomienia

Poniżej znajdziesz instrukcję krok po kroku, jak sklonować repozytorium, zainstalować zależności i uruchomić aplikację lokalnie.

### 📥 1. Sklonuj repozytorium

Zacznij od sklonowania projektu z GitHuba i przejdź do folderu projektu:

```bash
git clone https://github.com/KPR23/MVC_LAB.git
cd MVC_LAB/projekt
```

### 📦 2. Zainstaluj zależności

```bash
npm install
# lub
pnpm install
```

### 🔐 3. Utwórz plik .env w głównym folderze projektu

Wklej podane wartości do pliku .env

### 🚀 4. Uruchom serwer deweloperski

```bash
npm run dev
# lub
pnpm run dev
```

### 🌐 5. Otwórz przeglądarkę

Odwiedź stronę: [http://localhost:3000](http://localhost:3000)

Aplikacja powinna być teraz dostępna i gotowa do działania! 🎉

### 📷 6. Dodaj przykładowe wydarzenie

Dodaj przykładowe wydarzenie do listy wydarzeń korzystając z przykładu poniżej.

## 💻 Technologie

Projekt został zbudowany przy użyciu następujących technologii:

- **Next.js**
- **TypeScript**
- **Tailwind CSS**
- **Shadcn UI**
- **Stripe**
- **UploadThing**
- **Drizzle ORM**

## 📊 Przykładowe wydarzenie do wykorzystania w aplikacji

- Tytuł: Orange Warsaw Festival 2025
- Artyści:
  - Chappell Roan
  - Jamie XX
- Organizator: Alter Art
- Opis wydarzenia: Widzimy się w dniach 30-31 maja, na Torze Wyścigów Konnych Służewiec w Warszawie! Bilety na Orange Warsaw Festival 2025 juz dostępne.
- Kategoria: Muzyka
- Miasto: Warszawa
- Nazwa obiektu: Tor Wyścigów Konnych Służewiec
- Data: 30-31 maja 2025
- Cena biletu: 481,95 zł
- Pojemność obiektu: 10000
- Zdjęcie: w folderze /public/OWF.webp
