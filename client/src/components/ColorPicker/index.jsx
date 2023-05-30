import { HexColorPicker, HexColorInput } from 'react-colorful';
import style from './style.less';
export default function SwatchesPicker({ color, onChange }) {
  const presetColors = ['#ed556a', '#5bae23', '#f8b629', '#7829f8', '#0eb0c9', '#299bf8', '#248067'];

  return (
    <div className={style.picker}>
      <HexColorPicker color={color} onChange={onChange} style={{ width: '100%' }} />
      <div className={style.picker__swatches}>
        {presetColors.map((item) => (
          <button
            key={item}
            className={style.picker__swatch}
            style={{ background: item }}
            onClick={() => onChange(item)}
          />
        ))}
      </div>
      <HexColorInput color={color} onChange={onChange} />
    </div>
  );
}
