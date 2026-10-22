# Roadmapa rozwoju StockFlow ERP

Plan opisuje kolejne kroki rozwoju StockFlow jako aplikacji Angularowej. Na tym etapie pracujemy bez backendu: dane demonstracyjne i tymczasowe adaptery służą wyłącznie do budowania oraz testowania interfejsu. Nie zapewniają trwałego zapisu, prawdziwego uwierzytelniania, autoryzacji ani bezpieczeństwa.

## Co już jest w aplikacji

- Aplikacja Angular z obszarem publicznym i chronionym, nawigacją, lazy loadingiem tras, obsługą hash routing oraz powłoką przygotowaną do web i Electron.
- Pulpit startowy, strony błędów, motywy jasny/ciemny i tłumaczenia PL/EN.
- Formularz logowania i sesja działające lokalnie; wybór roli oraz stan sesji nie są weryfikowane przez serwer.
- Katalog ról, uprawnień i guardy interfejsu. Zatwierdzone są wyłącznie uprawnienia zarządzania użytkownikami: Administrator i Pracownik biurowy mogą zarządzać użytkownikami, a przypisywanie roli Administratora jest dostępne tylko Administratorowi. Pozostałych uprawnień nie należy zakładać.
- Ekran użytkowników: lista, filtrowanie, sortowanie, dodawanie, dezaktywowanie i raport CSV. Dane adaptera są tymczasowe i nie przetrwają odświeżenia strony.
- Klienci HTTP logowania i katalogu użytkowników przygotowani, ale niepodłączeni do działającego API.

## Kolejność prac — zakres bez backendu

### Krok 1. Ustalenie procesów i zakresu pierwszego wdrożenia

1. Spisać, kto korzysta z programu i jakie zadania wykonuje w magazynie oraz biurze.
2. Ustalić pierwszy obsługiwany scenariusz od początku do końca, np. przyjęcie towaru, jego lokalizacja i późniejsze wydanie.
3. Zatwierdzić pojęcia domenowe, wymagane pola, statusy dokumentów oraz przypadki błędów.
4. Uzupełnić macierz ról i uprawnień dopiero po zatwierdzeniu jej przez właściciela produktu. Nie przypisywać nieuzgodnionych uprawnień rolom.

**Efekt:** opisany, możliwy do przetestowania zakres pierwszego procesu bez wymyślania reguł biznesowych.

### Krok 2. Uporządkowanie fundamentów aplikacji

1. Utrzymać wspólny, responsywny interfejs dla przeglądarki i Electron.
2. Uzupełnić stany ładowania, pustych list, błędów i powodzenia w istniejących widokach.
3. Sprawdzić nawigację, etykiety formularzy, obsługę klawiaturą, widoczność fokusu i czytelność na wąskim ekranie.
4. Ujednolicić sposób wyświetlania błędów, komunikatów i potwierdzeń działań.

**Efekt:** przewidywalna i dostępna baza interfejsu dla kolejnych modułów.

### Krok 3. Dopracowanie modułu użytkowników

1. Uzupełnić walidację formularzy i komunikaty o błędach.
2. Dodać edycję danych oraz aktywację kont tylko po uzgodnieniu reguł tych operacji.
3. Zachować dotychczasowe ograniczenie przypisywania roli Administratora.
4. Dodać testy uprawnień do widoków i działań oraz przypadków błędnych danych.
5. Trzymać dane za wymiennym adapterem; jasno oznaczać ograniczenia tymczasowego przechowywania.

**Efekt:** kompletny interfejs zarządzania użytkownikami, nadal bez rzeczywistej autoryzacji i trwałego zapisu.

### Krok 4. Kartoteka produktów i jednostek

1. Uzgodnić wymagane pola produktu, identyfikatory, kategorie, jednostki miary i ewentualne warianty.
2. Przygotować listę, wyszukiwanie, filtrowanie oraz formularz dodawania i edycji.
3. Zaprojektować import dopiero po ustaleniu formatu pliku i reguł wykrywania duplikatów.
4. Dla interfejsu użyć wydzielonego, tymczasowego adaptera z danymi demonstracyjnymi.

**Efekt:** spójna kartoteka wykorzystywana przez kolejne procesy magazynowe.

### Krok 5. Magazyny i lokalizacje

1. Ustalić strukturę: magazyn, strefa i lokalizacja oraz to, które poziomy są potrzebne.
2. Określić, czy pracownik może działać w jednym, czy w wielu magazynach.
3. Przygotować widoki przeglądania i zarządzania lokalizacjami.
4. Nie tworzyć przypisań ani ograniczeń dostępu, dopóki nie zostaną ustalone zasady.

**Efekt:** model lokalizacji gotowy do użycia w przyjęciach, przesunięciach i wydaniach.

### Krok 6. Operacje i stany magazynowe

1. Najpierw zatwierdzić reguły przyjęć, wydań, przesunięć i korekt, w tym powody oraz wymagane źródło i cel.
2. Projektować historię jako jawne ruchy magazynowe; nie udostępniać operacji, która po cichu nadpisuje ilość.
3. Zbudować formularze, listy i podgląd historii na tymczasowych danych.
4. Uzgodnić obsługę ilości zerowych i ujemnych, rezerwacji, jednostek oraz konfliktów przed implementacją odpowiednich zachowań.
5. Oznaczyć mocki jako demonstracyjne: działanie w interfejsie nie dowodzi atomowości, trwałości ani spójności stanów.

**Efekt:** przetestowany przepływ ekranów i jawny model ruchów bez deklarowania wiarygodnego salda produkcyjnego.

### Krok 7. Inwentaryzacja

1. Ustalić zakres i harmonogram spisów oraz sposób przypisywania liczenia.
2. Określić, jak pokazywać różnice i kto może zatwierdzać korekty.
3. Zaprojektować obsługę równoległych ruchów podczas spisu.
4. Powiązać korekty z historią ruchów, a nie z bezpośrednią zmianą salda.

**Efekt:** przepływ spisu, rozbieżności i zatwierdzania opisany oraz odwzorowany w interfejsie.

### Krok 8. Zakupy i dostawcy

1. Uzgodnić pola kartoteki dostawcy.
2. Określić proces zapotrzebowania, zamówienia i przyjęcia, w tym dostawy częściowe.
3. Ustalić zwroty, reklamacje, statusy i dozwolone przejścia dokumentów.
4. Pokazać powiązanie przyjęcia z ruchem magazynowym.

**Efekt:** interfejs zakupowy powiązany z wcześniej ustalonymi produktami i lokalizacjami.

### Krok 9. Sprzedaż i odbiorcy

1. Uzgodnić kartotekę klienta i zakres danych, które są potrzebne użytkownikom.
2. Określić obsługę ofert i zamówień oraz ich statusów.
3. Ustalić zasady dostępności, rezerwacji, kompletacji, wysyłki i zwrotów.
4. Powiązać wydanie z jawnym ruchem magazynowym.

**Efekt:** interfejs realizacji sprzedaży bez założenia nieuzgodnionych zasad rezerwacji lub wysyłki.

### Krok 10. Dokumenty finansowe

1. Przed tworzeniem faktur uzgodnić typy dokumentów, numerację, walutę, podatki/VAT, zaokrąglenia i płatności.
2. Ustalić korekty, wymagane statusy i zasady niezmienności wystawionych dokumentów.
3. Sprawdzić wymagania prawne właściwe dla użytkowników i rynku.
4. Dopiero po tych decyzjach projektować formularze, podgląd, wydruk i testy wartości brzegowych.

**Efekt:** zatwierdzone wymagania dla dokumentów; nie implementować obliczeń ani reguł finansowych na podstawie domysłów.

### Krok 11. Dashboard, raporty i eksporty

1. Zebrać pytania operacyjne, na które mają odpowiadać dashboard i raporty.
2. Określić źródła danych, filtry, zakresy dat, uprawnienia i sposób obliczania każdego raportu.
3. Rozbudowywać istniejący raport CSV pracowników oraz wydruk/PDF tylko zgodnie z uzgodnionymi potrzebami.
4. Nie prezentować fikcyjnych wskaźników jako rzeczywistych danych ERP.

**Efekt:** raporty wynikające z uzgodnionych procesów, z jasno opisanymi źródłami.

### Krok 12. Testy, spójność i przygotowanie do dalszego rozwoju

1. Dla każdego przepływu dodać testy poprawnego przebiegu, odmowy dostępu w interfejsie, walidacji oraz błędów adaptera.
2. Utrzymywać kontrakty i adaptery oddzielone od komponentów, aby można je było później podłączyć do API.
3. Sprawdzić ponownie web i Electron po zmianach interfejsu.
4. Nie traktować testów frontendowych jako dowodu bezpieczeństwa, współbieżności ani poprawności danych produkcyjnych.

**Efekt:** przetestowany frontend z granicą adapterów, bez implementowania backendu.

## Zasady obowiązujące w tym etapie

- Backend C#/.NET i PostgreSQL pozostaje poza zakresem tych prac. Nie implementujemy API, bazy danych, migracji ani serwerowego uwierzytelniania.
- Tymczasowe adaptery są izolowane i wymienne; dane demonstracyjne nie są prawdziwym zapisem ERP.
- Guardy i ukrywanie elementów interfejsu poprawiają nawigację, ale nie zabezpieczają danych.
- Nie ustalamy samodzielnie ról, uprawnień, reguł stanów, podatków, walut, numeracji ani cyklu płatności.
- Każdy moduł powinien mieć jawne stany ładowania, pustych danych, błędów i powodzenia oraz testy zachowania.
- Integracje, skanery, drukarki i aplikacja mobilna są poza bieżącym zakresem; decyzje o nich podejmiemy po zebraniu konkretnych wymagań.
