import {
  IonButton,
  IonCol,
  IonGrid,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonRow,
  IonText,
  IonThumbnail,
} from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import React, { useState } from "react";

interface AddBookProps {
  selectedBook: any;
  setSelectedBook: (book: any) => void;
  selectedCategory: string | null;
}

const AddBook: React.FC<AddBookProps> = ({ selectedBook, setSelectedBook, selectedCategory }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchReults, setShowSearchResults] = useState<boolean>(false);

  const handleSearch = async (e: any) => {
    e.preventDefault();

    let query = searchQuery;

    switch (selectedCategory) {
      case "Author Meet and Greet":
        query += " author";
        break;
      case "Poetry Reading":
        query += " poetry";
        break;
      case "Writing Workshop":
        query += " writing";
        break;
      case "Book Trivia Night":
        query += " trivia";
        break;
      case "Literary Festival":
        query += " literature";
        break;
      case "Book Launch":
        query += " new release";
        break;
      default:
        break;
    }

    const apiKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      const filteredItems = data.items.filter((item: any) => {
        return item.volumeInfo.imageLinks && item.volumeInfo.authors && item.volumeInfo.description;
      });
      setSearchResults(filteredItems || []);

      setShowSearchResults(true);
    } catch (error) {
      console.error("Error fetching book info:", error);
    }
  };

  const searchAuthorByName = async (authorName: string) => {
    const query = encodeURIComponent(authorName);
    const url = `https://openlibrary.org/search.json?author=${query}&limit=1`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (data.docs[0].author_name && data.docs[0].author_key) {
        const authorKey = data.docs[0].author_key[0];
        const authorName = data.docs[0].author_name[0];

        return {
          authorKey,
          name: authorName,
        };
      } else {
        console.error("No authors found for the given name.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching author info from Open Library:", error);
      return null;
    }
  };

  const fetchAuthorDetailsFromOpenLibrary = async (authorKey: string) => {
    const url = `https://openlibrary.org/authors/${authorKey}.json`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      const name = data.name || "Unknown";
      const biography = data.bio || "Biography not available.";

      return {
        name,
        biography,
      };
    } catch (error) {
      console.error("Error fetching author details from Open Library:", error);
      return null;
    }
  };

  const handleBookSelect = async (book: any) => {
    const authorName = book.volumeInfo.authors[0];

    const data = await searchAuthorByName(authorName);

    if (data) {
      const getAuthor = await fetchAuthorDetailsFromOpenLibrary(data.authorKey);

      const authorDetails = {
        ...getAuthor,
        authorKey: data.authorKey,
      };

      const enhancedBook = {
        ...book,
        authorDetails,
      };

      setSelectedBook(enhancedBook);
      setSearchQuery("");
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const handleBookClear = () => {
    setSelectedBook(null);
  };

  const handleSearchClear = () => {
    setSearchResults([]);
    setShowSearchResults(false);
  };

  return (
    <>
      <IonInput
        label="Find related Book Info"
        labelPlacement="floating"
        fill="outline"
        mode="md"
        type="text"
        placeholder="Search for a book or author"
        value={searchQuery}
        onIonChange={(e) => setSearchQuery(e.detail.value!)}
        clearInput
      />
      <IonButton
        onClick={(e) => {
          handleSearch(e);
        }}
      >
        Search
      </IonButton>
      {showSearchReults && (
        <>
          <IonRow className="ion-justify-content-end" style={{ height: "1.25em" }}>
            <IonCol size="1.5">
              <IonButton shape="round" fill="clear" onClick={handleSearchClear}>
                <IonIcon slot="icon-only" icon={closeOutline} />
              </IonButton>
            </IonCol>
          </IonRow>
          <IonText>
            <p>Please select a title from the following:</p>
          </IonText>
          <IonList
            className="ion-padding"
            style={{
              background: "var(--ion-color-light-tint)",
            }}
          >
            {searchResults.map((result, index) => (
              <IonItem key={index} button onClick={() => handleBookSelect(result)}>
                <IonThumbnail slot="start">
                  <img src={result.volumeInfo.imageLinks.thumbnail} />
                </IonThumbnail>
                <IonLabel>
                  <h3>{result.volumeInfo.title}</h3>
                  <p>by {result.volumeInfo.authors?.join(", ")}</p>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        </>
      )}

      {selectedBook && (
        <IonGrid className="selectedBook">
          <IonRow className="ion-justify-content-end" style={{ height: "1.25em" }}>
            <IonCol size="1.5">
              <IonButton shape="round" fill="clear" onClick={handleBookClear}>
                <IonIcon slot="icon-only" icon={closeOutline} />
              </IonButton>
            </IonCol>
          </IonRow>
          <IonRow
            className="ion-padding ion-justify-content-center"
            style={{ background: "var(--ion-color-light-tint)" }}
          >
            <IonCol size="12">
              <IonText className="ion-padding-bottom">
                <h2 style={{ fontWeight: "500" }}>Selected Book:</h2>
              </IonText>
            </IonCol>
            <IonCol size="4">
              {selectedBook.volumeInfo.imageLinks?.thumbnail && (
                <img src={selectedBook.volumeInfo.imageLinks.thumbnail} alt="Book cover" />
              )}
            </IonCol>
            <IonCol size="8">
              <IonText>
                <p style={{ fontSize: "1.1em" }}>
                  <span style={{ fontWeight: "500" }}>{selectedBook.volumeInfo.title}</span> by{" "}
                  {selectedBook.volumeInfo.authors?.join(", ")}
                </p>
                <p className="ion-padding-top">{selectedBook.volumeInfo.description}</p>
              </IonText>
            </IonCol>
          </IonRow>
        </IonGrid>
      )}
    </>
  );
};

export default AddBook;
