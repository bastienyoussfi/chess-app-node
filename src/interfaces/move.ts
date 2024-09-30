import Position from "./position";

interface Move {
    from: Position;
    to: Position;
    promotion?: 'Q' | 'R' | 'B' | 'N';
}

export default Move;