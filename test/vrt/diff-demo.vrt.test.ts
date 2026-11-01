import { page } from 'vitest/browser';
import '@fontsource/noto-sans-jp/400.css';

// A small sample card for screenshot comparisons, which has nothing to do with the ToDo app.
// Each case compares the card as it is ("変える前") with a reference of its own and must match.
// `changedCss` is the one change each case is about.

const cardCss = `
  .card {
    box-sizing: border-box;
    width: 240px;
    padding: 16px;
    border: 1px solid #d0d7de;
    border-radius: 8px;
    font-family: 'Noto Sans JP', sans-serif;
  }
  .card h2 {
    margin: 0 0 12px;
    font-size: 18px;
    font-weight: 400;
  }
  .card button {
    display: block;
    width: 100%;
    padding: 6px 16px;
    border: 0;
    border-radius: 6px;
    background: #2563eb;
    color: #ffffff;
    font: inherit;
    font-size: 14px;
  }
`;

const shiftHeading = '.card h2 { padding-left: 1px; }';

// Vitest names the actual and diff images after the reference, so each case has a reference of its own,
// even though all of them show the same card. With a shared one, each case would overwrite the images
// of the case before it, both in .vitest/attachments/ and in Vitest UI.
const cases = [
  { name: 'ボタンの色', reference: 'button-color', changedCss: '.card button { background: #dc2626; }' },
  { name: '見出しの位置', reference: 'heading-position', changedCss: shiftHeading },
  { name: 'カードの高さ', reference: 'card-height', changedCss: '.card h2 { margin-bottom: 20px; }' },
];

// FIXME: Vitest 5.0.5 never clears the timer that limits the wait for a stable screenshot (`timeout`,
// 5 s by default), and `vitest run` does not exit until it fires. Every comparison that is not
// byte-identical to its reference starts one, and the card's rounded corners can differ by one shade
// between runs. The card is stable after two screenshots, so 1 s is plenty. Remove this once Vitest
// clears the timer (waitForStableScreenshot in @vitest/browser).
const matchOptions = { timeout: 1000 };

async function renderCard(changedCss = '') {
  document.body.innerHTML = `
    <style>${cardCss}${changedCss}</style>
    <article class="card">
      <h2>お知らせ</h2>
      <button type="button">保存</button>
    </article>
  `;
  const card = page.getByRole('article');
  // Noto Sans JP is split into many files by character, and a file loads only once some text needs it.
  // Load the files for this text now, so that the screenshot never catches the fallback font.
  await document.fonts.load('16px "Noto Sans JP"', card.element().textContent ?? '');
  return card;
}

describe('変える前', () => {
  test.for(cases)('$name', async ({ reference }) => {
    await expect(await renderCard()).toMatchScreenshot(reference, matchOptions);
  });
});
