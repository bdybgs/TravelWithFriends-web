import React from "react";
import styles from "./Tooltip.module.css";

interface TooltipProps {
  userStatus: number | null;
}

const Tooltip: React.FC<TooltipProps> = ({ userStatus }) => {
  const renderTooltip = () => {
    if (userStatus === 0) {
      return (
        <div>
          <p>Ваш статус <strong>Стандартный</strong>.</p>
          <table>
                <tbody>
                    <tr>
                        <td className="non-bold">Лимиты</td>
                        <td>Стандартный</td>
                        <td>Pro</td>
                    </tr>
                    <tr>
                        <td className="non-bold">Участники поездки</td>
                        <td>Не более 7</td>
                        <td>Не более 15</td>
                    </tr>
                    <tr>
                        <td className="non-bold">Путешествия всего</td>
                        <td>Не более 5</td>
                        <td>Не более 15</td>
                    </tr>
                    <tr>
                        <td className="non-bold">Траты через строку поиска</td>
                        <td>Не более 5</td>
                        <td>Не более 5</td>
                    </tr>
                    <tr>
                        <td className="non-bold">Траты всего в день</td>
                        <td>Не более 15</td>
                        <td>Не более 20</td>
                    </tr>
                </tbody>
            </table>
          <p>Для оформления подписки свяжитесь с нами.</p>
        </div>
      );
    } else if (userStatus === 2) {
      return (
        <div>
          <p><strong>У вас оформлена подписка, ваш статус Pro.</strong></p>
          <table>
            <tbody>
                <tr>
                    <td className="non-bold">Лимиты</td>                                
                    <td>Pro</td>
                </tr>
                <tr>
                    <td className="non-bold">Участники поездки</td>                                
                    <td>Не более 15</td>
                </tr>
                <tr>
                    <td className="non-bold">Путешествия всего</td>                               
                    <td>Не более 15</td>
                </tr>
                <tr>
                    <td className="non-bold">Траты через строку поиска</td>                                
                    <td>Не более 5</td>
                </tr>
                <tr>
                    <td className="non-bold">Траты всего в день</td>                               
                    <td>Не более 20</td>
                </tr>
            </tbody>
        </table>
        </div>
      );
    } else {
      return null;
    }
  };

  return (
    <div className={styles.tooltip}>
      {renderTooltip()}
    </div>
  );
};

export default Tooltip;
