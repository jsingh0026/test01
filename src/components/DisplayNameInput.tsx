import React, { useEffect, useState } from 'react';

interface Props {
  displayName: string;
  setDisplayName: (name: string) => void;
}

const DISPLAY_NAME_SETTINGS_KEY = '@andyet/talky-core-settings.nick';

function setLocalDisplayName(displayName: string) {
  localStorage.setItem(DISPLAY_NAME_SETTINGS_KEY, displayName);
}

function getLocalDisplayName() {
  const name = localStorage.getItem(DISPLAY_NAME_SETTINGS_KEY) || '';

  // The old talky-core saved all data by first JSON stringifying,
  // then JSON parsing on load. So we need to convert old data to
  // the new format:
  if (name === '"null"') {
    return null;
  }
  if (name.startsWith('"') && name.endsWith('"')) {
    return name.substring(1, name.length - 1); 
  }
  return name;
}

const DisplayNameInput: React.SFC<Props> = ({
  displayName,
  setDisplayName
}) => {
  const [typedName, setTypedName] = useState(
    displayName === 'Anonymous' ? '' : displayName
  );

  const persisDisplayName = (name: string) => {
    setDisplayName(name);
    setLocalDisplayName(name);
  };

  useEffect(() => {
    const localDisplayName = getLocalDisplayName();
    if (localDisplayName !== null && localDisplayName !== displayName) {
      setDisplayName(localDisplayName);
      setTypedName(localDisplayName);
    }
  }, [displayName, setDisplayName, setTypedName]);

  return (
    <input
      placeholder="My Name"
      value={displayName}
      maxLength={16}
      onChange={e => persisDisplayName(e.target.value)}
      onKeyPress={({ key }) => {
        if (key === 'Enter') {
          persisDisplayName(displayName);
        }
      }}
      onBlur={() => {
        persisDisplayName(displayName);
      }}
    />
  );
};

export default DisplayNameInput;
