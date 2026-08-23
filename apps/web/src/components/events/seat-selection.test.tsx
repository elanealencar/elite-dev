import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";

import { SeatSelection } from "./seat-selection";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock(
  "@/components/providers/auth-provider",
  () => ({
    useAuth: () => ({
      user: null,
      token: null,
      loading: false,
    }),
  })
);

const event = {
  id: "event-1",
  tmdbMovieId: 1,
  movieTitle: "Interestelar",
  moviePosterUrl: null,
  dateTime: "2026-09-20T23:00:00.000Z",
  location: "Cine Elite",
  room: "Sala 1",
  price: "40.00",
  capacity: 48,
  status: "PUBLISHED" as const,
  organizerId: "organizer-1",
  createdAt: "2026-08-20T00:00:00.000Z",
  updatedAt: "2026-08-20T00:00:00.000Z",
};

const seats = [
  {
    id: "seat-a1",
    eventId: "event-1",
    row: "A",
    number: 1,
    status: "AVAILABLE" as const,
    heldUntil: null,
  },
  {
    id: "seat-a2",
    eventId: "event-1",
    row: "A",
    number: 2,
    status: "SOLD" as const,
    heldUntil: null,
  },
];

describe("SeatSelection", () => {
  it("seleciona um assento disponível e atualiza o total", () => {
    render(
      <SeatSelection
        event={event}
        seats={seats}
      />
    );

    expect(
      screen.getByText("R$ 0,00")
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Assento A1",
      })
    );

    expect(
      screen.getByText("A1")
    ).toBeInTheDocument();

    expect(
      screen.getByText("R$ 40,00")
    ).toBeInTheDocument();
  });

  it("não permite selecionar assento indisponível", () => {
    render(
      <SeatSelection
        event={event}
        seats={seats}
      />
    );

    const soldSeat = screen.getByRole(
      "button",
      {
        name: "Assento A2",
      }
    );

    expect(soldSeat).toBeDisabled();
  });
});