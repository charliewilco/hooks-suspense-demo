import React from 'react';
import ReactDOM from 'react-dom';
import { unstable_createResource } from 'react-cache';

const getRepos = (lang = 'javascript') =>
  fetch(
    `https://github-trending-api.now.sh/repositories?language=${lang}&since=weekly`
  ).then(res => res.json());

import './styles.css';

function Spinner() {
  return (
    <h1 className="Spinner">
      <span role="img" aria-label="Cyclone Emoji">
        🌀
      </span>
    </h1>
  );
}

const Repos = unstable_createResource(getRepos);

function ListView({ language }) {
  const repos = Repos.read(language);

  return repos.map((repo, i) => (
    <div className="Repository" key={i}>
      <h3>
        <b>{repo.name}</b> / {repo.author}
        <a className="Repository__link" href={repo.url}>
          <span role="img" aria-label="Chain Link Emoji">
            🔗
          </span>
        </a>
      </h3>
      <p>{repo.description}</p>

      <aside>
        <div>
          <span role="img" aria-label="Star Emoji">
            🌟
          </span>{' '}
          {repo.stars}{' '}
          <span role="img" aria-label="Silverware Emoji">
            🍴
          </span>{' '}
          {repo.forks}
        </div>
        <div>
          <span role="img" aria-label="Book Emoji">
            📚
          </span>
          {repo.language}
        </div>
      </aside>
    </div>
  ));
}

function Options({ values, selected, onChange }) {
  return (
    <div className="Options">
      {values.map(({ name, value }, idx) => {
        const checked = selected === value;
        const className = ['Radio', checked ? 'active' : 'inactive'].join(' ');
        return (
          <div className={className} key={idx} onClick={() => onChange(value)}>
            <span className="OptionLabel">{name}</span>
          </div>
        );
      })}
    </div>
  );
}

function App() {
  const [language, setLanguage] = React.useState('javascript');
  return (
    <div className="Container">
      <h1 className="Title">Repos</h1>
      <Options
        selected={language}
        onChange={setLanguage}
        values={[
          { name: 'JavaScript', value: 'javascript' },
          { name: 'TypeScript', value: 'typescript' },
          { name: 'Python', value: 'python' },
          { name: 'Scala', value: 'scala' },
          { name: 'Ruby', value: 'ruby' }
        ]}
      />
      <React.Suspense fallback={<Spinner />}>
        <ListView language={language} />
      </React.Suspense>
    </div>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
