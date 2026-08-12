import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './reset.css';
import './App.css';
import Card from './Card';
import DropDown from './DropDown';
import Footer from './Footer';
import MigrationNotice from './MigrationNotice';
import NotFound from './NotFound';
import Radio from './Radio';
import TextInput from './TextInput';
import TopBar from './TopBar';
import { allCards, defaultCardSort } from './const';
import useDeckState from './hooks/useDeckState';
import { createCanonicalUrl } from './siteUrl';

const CARD_TYPE_VALUE = {
  Personality: 0,
  Buff: 1,
  Debuff: 2,
  Weapon: 3,
  Helper: 4,
  Wild: 5,
  Trap: 6,
};

const CARD_SORTERS = {
  id: defaultCardSort,
  cost: (a, b) => a.cost - b.cost || defaultCardSort(a, b),
  type: (a, b) =>
    a.type === b.type
      ? defaultCardSort(a, b)
      : CARD_TYPE_VALUE[a.type] - CARD_TYPE_VALUE[b.type],
};

const FILTER_OPTIONS = [
  { label: 'All', value: 'All', icon: null },
  { label: 'Personality', value: 'Personality', icon: 'personality_icon.webp' },
  { label: 'Buff', value: 'Buff', icon: 'buff_icon.webp' },
  { label: 'Debuff', value: 'Debuff', icon: 'debuff_icon.webp' },
  { label: 'Weapon', value: 'Weapon', icon: 'weapon_icon.webp' },
  { label: 'Helper', value: 'Helper', icon: 'helper_icon.webp' },
  { label: 'Wild', value: 'Wild', icon: 'wild_icon.webp' },
  { label: 'Trap', value: 'Trap', icon: 'trap_icon.webp' },
];

const SORT_OPTIONS = [
  { value: 'id', label: 'ID' },
  { value: 'cost', label: 'Cost' },
  { value: 'type', label: 'Type' },
];

function toggleCard(deck, card) {
  return deck.some((deckCard) => deckCard.id === card.id)
    ? deck.filter((deckCard) => deckCard.id !== card.id)
    : [...deck, card];
}

function groupDeckByCost(deck) {
  const groups = new Map();

  for (const card of deck) {
    const order = card.type === 'Personality' ? 1000 : card.cost;
    groups.set(order, [...(groups.get(order) ?? []), card]);
  }

  return [...groups.entries()].sort(([a], [b]) => b - a);
}

export default function App() {
  const [myDeck, setMyDeck] = useDeckState();
  const [cardFilter, setCardFilter] = useState('All');
  const [cardSearch, setCardSearch] = useState('');
  const [cardSort, setCardSort] = useState('id');
  const [successfulCopies, setSuccessfulCopies] = useState([]);
  const copyPasteRef = useRef();
  const isItchBuild = import.meta.env.MODE === 'itch';

  const myCards = useMemo(
    () => myDeck.filter((card) => card.type !== 'Personality'),
    [myDeck]
  );
  const deckIds = useMemo(() => new Set(myDeck.map((card) => card.id)), [myDeck]);
  const deckRows = useMemo(() => groupDeckByCost(myDeck), [myDeck]);

  const filteredAndSortedCards = useMemo(() => {
    const normalizedSearch = cardSearch.trim().toLowerCase();

    return allCards
      .filter((card) =>
        cardFilter === 'All' ? card.type !== 'Personality' : card.type === cardFilter
      )
      .filter(
        (card) =>
          normalizedSearch.length === 0 ||
          card.name.toLowerCase().includes(normalizedSearch)
      )
      .sort(CARD_SORTERS[cardSort]);
  }, [cardFilter, cardSearch, cardSort]);

  const shareableUrl = isItchBuild
    ? window.location.href
    : createCanonicalUrl(window.location);
  const copyShareableUrl = useCallback(
    async (event) => {
      copyPasteRef.current?.select();

      try {
        await navigator.clipboard.writeText(shareableUrl);
        setSuccessfulCopies((copies) => [
          ...copies,
          {
            id: `${Date.now().toString(36)}-${copies.length}`,
            x: event.clientX,
            y: event.clientY,
          },
        ]);
      } catch {
        // The selected input remains available as a manual copy fallback.
      }
    },
    [shareableUrl]
  );

  const deckCost = myCards.reduce((total, card) => total + card.cost, 0);
  const deckIsEmpty = myDeck.length === 0;
  return (
    <div className="App">
      {successfulCopies.map((copyEvent) => (
        <CopiedPopup
          key={copyEvent.id}
          event={copyEvent}
          onDone={() =>
            setSuccessfulCopies((copies) =>
              copies.filter((copy) => copy.id !== copyEvent.id)
            )
          }
        />
      ))}

      {!isItchBuild && <MigrationNotice />}

      <TopBar
        deckCost={deckCost}
        deckCount={myCards.length}
        onReset={() => setMyDeck([])}
        shareableUrl={shareableUrl}
        copyPasteRef={copyPasteRef}
        onCopy={copyShareableUrl}
      />

      <div className={`myDeck ${deckIsEmpty ? 'hello' : ''}`}>
        {deckIsEmpty && (
          <>
            <p style={{ fontSize: '2em' }}>Hey there friend!</p>
            <p>Pick some cards below to create your ultimate deck!</p>
            {!isItchBuild && (
              <p>The URL updates as you go, so your build is always ready to share.</p>
            )}
          </>
        )}

        {deckRows.map(([order, cards]) => (
          <div className="row" key={order}>
            {cards.map((card) => (
              <Card
                card={card}
                aria-label={`Remove ${card.name} from deck`}
                onClick={() =>
                  setMyDeck(myDeck.filter((deckCard) => deckCard.id !== card.id))
                }
                key={`mydeck${card.id}`}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="filters">
        <div className="cardTypes">
          <Radio options={FILTER_OPTIONS} value={cardFilter} onChange={setCardFilter} />
        </div>
        <label className="filterControl" htmlFor="card-search">
          Search:
          <TextInput
            id="card-search"
            aria-label="Search cards"
            value={cardSearch}
            onChange={setCardSearch}
          />
        </label>
        <label className="filterControl" htmlFor="card-sort">
          Sort:
          <DropDown
            id="card-sort"
            options={SORT_OPTIONS}
            value={cardSort}
            onChange={setCardSort}
          />
        </label>
      </div>

      <div className="content">
        {filteredAndSortedCards.length > 0 ? (
          filteredAndSortedCards.map((card) => (
            <Card
              card={card}
              equipped={deckIds.has(card.id)}
              onClick={() => setMyDeck(toggleCard(myDeck, card))}
              key={`content${card.id}`}
            />
          ))
        ) : (
          <NotFound cardSearch={cardSearch} />
        )}
      </div>
      <Footer />
    </div>
  );
}

const COPIED_POPUP_TIMEOUT = 500;

function CopiedPopup({ event, onDone }) {
  const copiedRef = useRef();

  useEffect(() => {
    const animateTimer = window.setTimeout(() => {
      if (!copiedRef.current) return;
      copiedRef.current.style.opacity = 0;
      copiedRef.current.style.transform = 'translate(-50%, -150%)';
    }, 100);
    const removeTimer = window.setTimeout(onDone, 100 + COPIED_POPUP_TIMEOUT);

    return () => {
      window.clearTimeout(animateTimer);
      window.clearTimeout(removeTimer);
    };
  }, [onDone]);

  return (
    <div
      role="status"
      ref={copiedRef}
      style={{
        position: 'fixed',
        top: `${event.y}px`,
        left: `${event.x}px`,
        zIndex: 999,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        opacity: 1,
        transition: `opacity ${COPIED_POPUP_TIMEOUT}ms, transform ${COPIED_POPUP_TIMEOUT}ms`,
      }}>
      Copied!
    </div>
  );
}
