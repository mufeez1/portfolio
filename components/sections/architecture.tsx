"use client";

import { useId, useMemo, useState } from "react";
import { useReducedMotion } from "motion/react";
import { archEdges, archNodes } from "@/data/architecture";
import type { ArchNodeKind } from "@/types";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/utils";

const VIEW_W = 1000;
const VIEW_H = 620;

const kindLabel: Record<ArchNodeKind, string> = {
  client: "Client",
  edge: "Edge",
  service: "Service",
  datastore: "Datastore",
  cache: "Cache",
  queue: "Message log",
  external: "External",
};

/** Kind is encoded by a dot colour *and* a text label — never by colour alone. */
const kindDot: Record<ArchNodeKind, string> = {
  client: "bg-faint",
  edge: "bg-subtle",
  service: "bg-accent",
  datastore: "bg-emerald-500",
  cache: "bg-amber-500",
  queue: "bg-violet-500",
  external: "bg-faint",
};

const nodeById = new Map(archNodes.map((node) => [node.id, node]));

/**
 * Half-extent of a node's box in viewBox units. The boxes are HTML with
 * text-dependent widths, so this is a linear fit against measured label
 * widths rather than a live measurement, biased slightly large: an edge that
 * stops a little short reads as deliberate spacing, while one that stops long
 * hides its own arrowhead behind the box.
 */
const halfExtent = (label: string) => ({ rx: 32 + label.length * 4.15, ry: 30 });

/**
 * Distance from a node's centre to its box edge along a direction. This is a
 * rectangle, not an ellipse — the ellipse form under-trims on diagonals, which
 * is precisely where the arrowheads used to disappear.
 */
function inset(ux: number, uy: number, rx: number, ry: number): number {
  const horizontal = Math.abs(ux) < 1e-6 ? Infinity : rx / Math.abs(ux);
  const vertical = Math.abs(uy) < 1e-6 ? Infinity : ry / Math.abs(uy);
  return Math.min(horizontal, vertical);
}

/**
 * Gentle S-curve between two nodes, trimmed to their boundaries so the
 * arrowhead lands in open space. Horizontal control points read as flow.
 */
function edgePath(fromId: string, toId: string): string {
  const a = nodeById.get(fromId);
  const b = nodeById.get(toId);
  if (!a || !b) return "";

  const vx = b.x - a.x;
  const vy = b.y - a.y;
  const length = Math.hypot(vx, vy) || 1;
  const ux = vx / length;
  const uy = vy / length;

  const from = halfExtent(a.label);
  const to = halfExtent(b.label);
  const startInset = inset(ux, uy, from.rx, from.ry);
  const endInset = inset(ux, uy, to.rx, to.ry);

  // Never let the trim consume the whole edge on a short hop.
  const usable = Math.max(length - startInset - endInset, length * 0.15);
  const scale = usable / Math.max(length - startInset - endInset, 1);

  const sx = a.x + ux * startInset;
  const sy = a.y + uy * startInset;
  const ex = b.x - ux * endInset * scale;
  const ey = b.y - uy * endInset * scale;

  const cx = Math.abs(ex - sx) * 0.5;
  return `M ${sx} ${sy} C ${sx + cx} ${sy}, ${ex - cx} ${ey}, ${ex} ${ey}`;
}

/** Midpoint of the trimmed curve, for placing an edge label. */
function edgeMidpoint(d: string): { x: number; y: number } | null {
  const nums = d.match(/-?\d+(?:\.\d+)?/g);
  if (!nums || nums.length < 8) return null;
  const [sx, sy, c1x, c1y, c2x, c2y, ex, ey] = nums.slice(0, 8).map(Number) as number[];
  // Cubic Bezier at t = 0.5.
  return {
    x: (sx! + 3 * c1x! + 3 * c2x! + ex!) / 8,
    y: (sy! + 3 * c1y! + 3 * c2y! + ey!) / 8,
  };
}

export function Architecture() {
  const [selected, setSelected] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();
  const panelId = useId();

  const paths = useMemo(
    () =>
      archEdges.map((edge) => {
        const d = edgePath(edge.from, edge.to);
        return { ...edge, d, mid: edgeMidpoint(d) };
      }),
    [],
  );

  const active = selected ? nodeById.get(selected) : undefined;
  const isConnected = (id: string) =>
    !selected ||
    archEdges.some(
      (edge) =>
        (edge.from === selected && edge.to === id) ||
        (edge.to === selected && edge.from === id),
    );

  return (
    <Section
      id="architecture"
      index="05"
      title="Systems I build"
      lede="The reference shape behind the work above: a multi-tenant platform where the request path stays synchronous only for as long as it must, with the AI layer inheriting the same isolation rules. Select any component for the reasoning behind it."
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10">
        {/* min-w-0: without it the scrollable diagram widens the grid track
            instead of scrolling inside it, overflowing the page on mobile. */}
        <div className="min-w-0">
          <div className="border-line bg-raised/40 overflow-x-auto rounded-2xl border">
            <div
              className="relative mx-auto min-w-[720px]"
              style={{ aspectRatio: `${VIEW_W} / ${VIEW_H}` }}
            >
              <svg
                viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
                aria-hidden="true"
                focusable="false"
                className="absolute inset-0 size-full"
              >
                <defs>
                  {/* Two markers rather than currentColor: a marker resolves
                      currentColor against <defs>, not against the path that
                      references it, so it cannot follow the edge's state. */}
                  <marker
                    id="arrow"
                    viewBox="0 0 10 10"
                    refX="8"
                    refY="5"
                    markerWidth="5"
                    markerHeight="5"
                    orient="auto"
                  >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--line-strong)" />
                  </marker>
                  <marker
                    id="arrow-active"
                    viewBox="0 0 10 10"
                    refX="8"
                    refY="5"
                    markerWidth="5.5"
                    markerHeight="5.5"
                    orient="auto"
                  >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent)" />
                  </marker>
                </defs>

                {paths.map((edge) => {
                  const highlighted =
                    selected !== null &&
                    (edge.from === selected || edge.to === selected);
                  const dimmed = selected !== null && !highlighted;

                  return (
                    <g
                      key={`${edge.from}-${edge.to}`}
                      className={cn(
                        "transition-opacity duration-300",
                        highlighted ? "text-accent" : "text-line-strong",
                        highlighted ? "opacity-100" : dimmed ? "opacity-20" : "opacity-55",
                      )}
                    >
                      <path
                        d={edge.d}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={highlighted ? 2 : 1.25}
                        strokeDasharray={edge.async ? "5 5" : undefined}
                        markerEnd={highlighted ? "url(#arrow-active)" : "url(#arrow)"}
                      />
                      {/* Traffic tokens on async edges only, where they carry meaning. */}
                      {edge.async && !reducedMotion ? (
                        <circle r="3.5" fill="currentColor">
                          <animateMotion
                            dur="3.2s"
                            repeatCount="indefinite"
                            path={edge.d}
                            keyPoints="0;1"
                            keyTimes="0;1"
                            calcMode="linear"
                          />
                        </circle>
                      ) : null}
                    </g>
                  );
                })}
              </svg>

              {/* Nodes are real buttons, not SVG shapes: focusable, labelled and
                  keyboard-operable without re-implementing any of it. */}
              {archNodes.map((node) => {
                const isSelected = selected === node.id;
                return (
                  <button
                    key={node.id}
                    type="button"
                    aria-pressed={isSelected}
                    aria-describedby={isSelected ? panelId : undefined}
                    onClick={() => setSelected(isSelected ? null : node.id)}
                    style={{
                      left: `${(node.x / VIEW_W) * 100}%`,
                      top: `${(node.y / VIEW_H) * 100}%`,
                    }}
                    className={cn(
                      "absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2",
                      "bg-canvas rounded-lg border px-3 py-2 text-left whitespace-nowrap",
                      "transition-[border-color,opacity,box-shadow] duration-300",
                      isSelected
                        ? "border-accent shadow-[0_0_0_3px_var(--accent-soft)]"
                        : "border-line-strong hover:border-text/35",
                      isConnected(node.id) ? "text-text" : "border-line text-subtle",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "size-1.5 shrink-0 rounded-full",
                        kindDot[node.kind],
                      )}
                    />
                    <span className="text-[0.8125rem] font-medium">{node.label}</span>
                    <span className="sr-only"> — {kindLabel[node.kind]}</span>
                  </button>
                );
              })}

              {/* Edge labels live in the HTML layer, above the node boxes.
                  As SVG <text> they were clipped by whichever box the curve's
                  midpoint happened to fall behind. Shown only for the selected
                  node, so the resting view stays uncluttered. */}
              {paths.map((edge) =>
                selected !== null &&
                (edge.from === selected || edge.to === selected) &&
                edge.mid ? (
                  <span
                    key={`label-${edge.from}-${edge.to}`}
                    aria-hidden="true"
                    style={{
                      left: `${(edge.mid.x / VIEW_W) * 100}%`,
                      top: `${(edge.mid.y / VIEW_H) * 100}%`,
                    }}
                    className="border-line bg-canvas text-accent pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded border px-1.5 py-0.5 font-mono text-[0.625rem] whitespace-nowrap"
                  >
                    {edge.label}
                  </span>
                ) : null,
              )}
            </div>
          </div>

          <p className="text-faint mt-3 font-mono text-[0.6875rem]">
            Dashed edges are asynchronous. Scroll horizontally on small screens.
          </p>
        </div>

        <div
          id={panelId}
          aria-live="polite"
          className="border-line bg-raised/40 rounded-2xl border p-6 lg:sticky lg:top-24 lg:self-start"
        >
          {active ? (
            /* key forces a remount so the CSS entrance replays on each
               selection. Transform-only, like every other entrance here: the
               panel's text has to be readable the instant it appears. */
            <div key={active.id} className="animate-rise">
              <p className="text-faint font-mono text-[0.6875rem] tracking-wide uppercase">
                {kindLabel[active.kind]}
              </p>
              <h3 className="mt-2 text-lg font-semibold tracking-tight">
                {active.label}
              </h3>
              <p className="text-muted mt-3 text-[0.9375rem] leading-relaxed">
                {active.detail}
              </p>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="text-subtle decoration-line-strong hover:text-text mt-6 text-sm underline underline-offset-4 transition-colors"
              >
                Clear selection
              </button>
            </div>
          ) : (
            <div>
              <p className="text-faint font-mono text-[0.6875rem] tracking-wide uppercase">
                Legend
              </p>
              <ul className="mt-4 space-y-2.5">
                {(Object.keys(kindLabel) as ArchNodeKind[])
                  .filter((kind) => archNodes.some((node) => node.kind === kind))
                  .map((kind) => (
                    <li
                      key={kind}
                      className="text-muted flex items-center gap-2.5 text-sm"
                    >
                      <span
                        aria-hidden="true"
                        className={cn("size-1.5 rounded-full", kindDot[kind])}
                      />
                      {kindLabel[kind]}
                    </li>
                  ))}
              </ul>
              <p className="text-subtle mt-6 text-sm leading-relaxed">
                Select a component to see why it is there and what guarantee it
                provides.
              </p>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
