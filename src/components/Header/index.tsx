import { css } from "@emotion/css";
import { GrafanaTheme2 } from "@grafana/data";

import { useStyles } from "../../theme";
import ThemeSwitch from "./ThemeSwitch";

const Header = () => {
  const styles = useStyles(getStyles);
  return (
    <div className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.flex}>
          <img
            src={`${process.env.PUBLIC_URL}/alloy_icon_orange.svg`}
            alt={"Grafana logo"}
            className={styles.logo}
          />
          <h4 className={styles.headerText}>Alloy Configuration Generator</h4>
        </div>
        <div className={styles.flex}>
          <a
            className={styles.icon}
            href={"https://github.com/grafana/alloy-configurator"}
            target={"_blank"}
            rel={"noreferrer noopenner"}
          >
            <svg
              fill="currentColor"
              width="24px"
              height="24px"
              xmlns="http://www.w3.org/2000/svg"
              data-name="Layer 1"
              viewBox="0 0 24 24"
            >
              <path d="M12,2.2467A10.00042,10.00042,0,0,0,8.83752,21.73419c.5.08752.6875-.21247.6875-.475,0-.23749-.01251-1.025-.01251-1.86249C7,19.85919,6.35,18.78423,6.15,18.22173A3.636,3.636,0,0,0,5.125,16.8092c-.35-.1875-.85-.65-.01251-.66248A2.00117,2.00117,0,0,1,6.65,17.17169a2.13742,2.13742,0,0,0,2.91248.825A2.10376,2.10376,0,0,1,10.2,16.65923c-2.225-.25-4.55-1.11254-4.55-4.9375a3.89187,3.89187,0,0,1,1.025-2.6875,3.59373,3.59373,0,0,1,.1-2.65s.83747-.26251,2.75,1.025a9.42747,9.42747,0,0,1,5,0c1.91248-1.3,2.75-1.025,2.75-1.025a3.59323,3.59323,0,0,1,.1,2.65,3.869,3.869,0,0,1,1.025,2.6875c0,3.83747-2.33752,4.6875-4.5625,4.9375a2.36814,2.36814,0,0,1,.675,1.85c0,1.33752-.01251,2.41248-.01251,2.75,0,.26251.1875.575.6875.475A10.0053,10.0053,0,0,0,12,2.2467Z" />
            </svg>
          </a>
          <ThemeSwitch className={styles.themeSwitch} />
        </div>
      </div>
    </div>
  );
};

const getStyles = (theme: GrafanaTheme2) => {
  return {
    flex: css`
      display: flex;
      align-items: center;

      & > * {
        margin-right: ${theme.spacing(2)};
      }
    `,
    header: css`
      display: flex;
      justify-content: center;
      gap: 20px;
      height: 81px;
      position: fixed;
      width: 100vw;
      padding: 10px 40px;
      border: 1px solid ${theme.colors.border.weak};
      border-radius: 2px;
      color: ${theme.colors.text.primary};
      z-index: 1060;
      background-color: ${theme.colors.background.primary};
    `,
    headerText: css`
      margin-bottom: 0;
    `,
    themeSwitch: css`
      color: ${theme.colors.text.primary};
      cursor: pointer;
    `,
    logo: css`
      width: 35px;
      height: 35px;
      margin-right: 10px;
    `,
    icon: css`
      color: ${theme.colors.text.primary};
    `,
    headerContent: css`
      display: flex;
      width: 80vw;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
    `,
  };
};
export default Header;
