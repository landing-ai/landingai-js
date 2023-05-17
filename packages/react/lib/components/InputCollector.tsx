import React, { useState } from "react";
import { ApiInfo } from "@landingai-js/core";
import styles from "./index.module.css";

export type InputCollectorProps = {
  apiInfo: ApiInfo;
  onSetButtonClick: (apiInfo: ApiInfo) => void;
};

const InputInfo: Array<{
  key: keyof ApiInfo;
  label: string;
}> = [
  {
    key: "endpoint",
    label: "Endpoint",
  },
  {
    key: "key",
    label: "Api Key",
  },
  {
    key: "secret",
    label: "Api Secret",
  },
];

export const InputCollector: React.FC<InputCollectorProps> = (props) => {
  const { apiInfo, onSetButtonClick } = props;
  const [info, setInfo] = useState<ApiInfo>(apiInfo);
  const [showError, setShowError] = useState<Boolean>(false);

  const onClick = () => {
    const hasEmpty = info.endpoint.trim().length === 0;
    if (hasEmpty) {
      setShowError(true);
    } else {
      onSetButtonClick(info);
    }
  };

  return (
    <>
      <div>
        {InputInfo.map((input) => (
          <div key={input.key} className={styles.inputGroup}>
            <label>{input.label}:</label>
            <input
              value={info[input.key]}
              onChange={(e) =>
                setInfo({
                  ...info,
                  [input.key]: e.target.value,
                })
              }
            />
            {showError && !!info[input.key] && info[input.key]!.trim().length === 0 && (
              <label className={styles.errorLabel}>Value cannot be empty</label>
            )}
          </div>
        ))}
      </div>
      <button className={styles.bottomButton} onClick={onClick}>Set</button>
    </>
  );
};
